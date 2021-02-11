using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Base.EF
{
    public abstract class EntityTypeConfiguration<TEntity> where TEntity : class
    {
        public abstract void Map(EntityTypeBuilder<TEntity> builder);
    }

}
