using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore.Query;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Common;

public static class PaginationQueryableExtensions
{

  public static async Task<PaginationResult<TDestination>> ToPaginationResultAsync<TSource, TDestination>(
      this IQueryable<TSource> queryable,
      Expression<Func<TSource, TDestination>> selector,
      PaginationParameters<TDestination> parameters,
      CancellationToken cancellationToken = default)
  {
    IQueryable<TDestination> destinationQueryable = queryable.Select(selector);

    int totalCount;
    List<TDestination> items;

    if (destinationQueryable.Provider is IAsyncQueryProvider)
    {
      totalCount = await destinationQueryable.CountAsync(cancellationToken);

      if (totalCount == 0)
      {
        return PaginationResult<TDestination>.Create(new List<TDestination>(), 0, parameters);
      }

      var sortedQuery = ApplySorting(destinationQueryable, parameters);

      var pagedQuery = sortedQuery
          .Skip((parameters.PageNumber - 1) * parameters.PageSize)
          .Take(parameters.PageSize);

      items = await pagedQuery.ToListAsync(cancellationToken);
    }
    else
    {
      totalCount = destinationQueryable.Count();

      if (totalCount == 0)
      {
        return PaginationResult<TDestination>.Create(new List<TDestination>(), 0, parameters);
      }

      var sortedQuery = ApplySorting(destinationQueryable, parameters);

      var pagedQuery = sortedQuery
          .Skip((parameters.PageNumber - 1) * parameters.PageSize)
          .Take(parameters.PageSize);

      items = pagedQuery.ToList();
    }

    return PaginationResult<TDestination>.Create(items, totalCount, parameters);
  }

  public static async Task<PaginationResult<TDestination>> ToPaginationResultAsync<TSource, TDestination>(
      this IEnumerable<TSource> source,
      Expression<Func<TSource, TDestination>> selector,
      PaginationParameters<TDestination> parameters,
      CancellationToken cancellationToken = default)
  {
    var queryable = source.AsQueryable();

    return await ToPaginationResultAsync(queryable, selector, parameters, cancellationToken);
  }

  private static IQueryable<TEntity> ApplySorting<TEntity>(IQueryable<TEntity> queryable, PaginationParameters<TEntity> parameters)
  {
    var type = typeof(TEntity);
    var property = type.GetProperty(parameters.SortField,
        BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

    if (property == null)
    {
      property = type.GetProperty(PaginationParameters<TEntity>.DefaultSortField,
          BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

      if (property != null)
      {
        parameters.SortField = PaginationParameters<TEntity>.DefaultSortField;
      }
      else
      {
        return queryable;
      }
    }

    var parameter = Expression.Parameter(type, "x");

    var propertyAccess = Expression.Property(parameter, property);

    var lambda = Expression.Lambda(propertyAccess, parameter);

    var methodName = parameters.Ascending ? "OrderBy" : "OrderByDescending";

    var methods = typeof(Queryable).GetMethods()
        .Where(m => m.Name == methodName && m.IsGenericMethodDefinition && m.GetParameters().Length == 2);

    var method = methods.FirstOrDefault()?.MakeGenericMethod(type, property.PropertyType);

    if (method == null)
    {
      return queryable;
    }

    try
    {
      return (IQueryable<TEntity>)method.Invoke(null!, [queryable, lambda])!;
    }
    catch
    {
      return queryable;
    }
  }
}
