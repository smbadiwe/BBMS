using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;

namespace Base.EF
{
    public static class ModelBuilderExtensions
    {
        public static void AddConfiguration<TEntity>(ModelBuilder modelBuilder, EntityTypeConfiguration<TEntity> configuration)
            where TEntity : class
        {
            configuration.Map(modelBuilder.Entity<TEntity>());
        }
    }

    public class BaseDbContext : DbContext
    {
        private readonly IConfiguration appConfig;

        public BaseDbContext(DbContextOptions<BaseDbContext> options, IConfiguration appConfig)
            : base(options)
        {
            this.appConfig = appConfig;
        }

        protected BaseDbContext(IConfiguration appConfig, DbContextOptions options)
            : base(options)
        {
            this.appConfig = appConfig;
        }

        public virtual string GetTableName<T>() where T : class
        {
            var entityType = Model.GetEntityTypes().First(t => t.ClrType == typeof(T));
            var tableNameAnnotation = entityType.FindAnnotation("Relational:TableName");
            var tableName = tableNameAnnotation.Value.ToString();
            return tableName;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var whereEntitiesAre = appConfig["EntityAssemblies"] ?? "";
            var whereMappingFilesAre = appConfig["MappingFileAssemblies"] ?? "";
            Type rootEntity = typeof(Entity);
            var entityTypes = new List<Type>();
            foreach (var assembly in whereEntitiesAre.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries))
            {
                try
                {
                    entityTypes.AddRange(Assembly.Load(assembly).GetExportedTypes()
                                .Where(t => t.IsClass && !t.IsAbstract && rootEntity.IsAssignableFrom(t))
                                );
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }

            var mappedEntityTypes = new List<Type>();
            foreach (var assembly in whereMappingFilesAre.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries))
            {
                var typesToRegister = Assembly.Load(assembly).GetExportedTypes()
                    .Where(type =>
                    {
                        var baseInfo = type.GetTypeInfo()?.BaseType;
                        return type.IsClass && !type.IsAbstract &&
                            baseInfo != null && baseInfo.GetTypeInfo().IsGenericType &&
                            baseInfo.GetGenericTypeDefinition() == typeof(EntityTypeConfiguration<>);
                    });

                foreach (var type in typesToRegister)
                {
                    dynamic configurationInstance = Activator.CreateInstance(type);
                    ModelBuilderExtensions.AddConfiguration(modelBuilder, configurationInstance);
                }

                mappedEntityTypes.AddRange(typesToRegister);
            }

            var fet = new HashSet<Type>(mappedEntityTypes);
            foreach (var t in entityTypes)
            {
                if (fet.Contains(t)) continue;
                if (t.GetCustomAttribute<NotMappedAttribute>() != null)
                    modelBuilder.Ignore(t);
                else
                    modelBuilder.Entity(t);
            }
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(appConfig.GetConnectionString("DefaultConnection"));
        }
    }
}
