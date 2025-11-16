using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;

namespace Laczynski.ChangeMe.Backend.Shared.Pagination;

/// <summary>
/// Builder for applying DataGrid filters to IQueryable using Expression trees.
/// </summary>
public static class FilterQueryBuilder
{
    /// <summary>
    /// Applies filters to the queryable.
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    /// <param name="queryable">Source queryable</param>
    /// <param name="filters">List of active filters</param>
    /// <returns>Filtered queryable</returns>
    public static IQueryable<T> ApplyFilters<T>(
        this IQueryable<T> queryable,
        List<DataGridActiveFilter>? filters)
    {
        if (filters == null || !filters.Any())
            return queryable;

        foreach (var filter in filters)
        {
            queryable = ApplyFilter(queryable, filter);
        }

        return queryable;
    }

    private static IQueryable<T> ApplyFilter<T>(
        IQueryable<T> queryable,
        DataGridActiveFilter filter)
    {
        // Use field if available (preferred), otherwise fallback to columnId
        var fieldName = !string.IsNullOrWhiteSpace(filter.Field)
            ? filter.Field
            : filter.ColumnId;

        if (string.IsNullOrWhiteSpace(fieldName))
            return queryable;

        var entityType = typeof(T);
        var property = entityType.GetProperty(
            fieldName,
            BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

        if (property == null)
            return queryable; // Property not found, skip filter

        var parameter = Expression.Parameter(entityType, "x");
        var propertyAccess = Expression.Property(parameter, property);
        var filterValue = filter.Filter;

        Expression? filterExpression = null;

        switch (filter.Type.ToLower())
        {
            case "text":
                filterExpression = BuildTextFilter(propertyAccess, filterValue, parameter);
                break;
            case "number":
                filterExpression = BuildNumberFilter(propertyAccess, filterValue, parameter);
                break;
            case "date":
                filterExpression = BuildDateFilter(propertyAccess, filterValue, parameter);
                break;
            case "select":
            case "multi-select":
                filterExpression = BuildSelectFilter(propertyAccess, filterValue, filter.Type == "multi-select");
                break;
            case "boolean":
                filterExpression = BuildBooleanFilter(propertyAccess, filterValue);
                break;
        }

        if (filterExpression == null)
            return queryable;

        var lambda = Expression.Lambda<Func<T, bool>>(filterExpression, parameter);
        return queryable.Where(lambda);
    }

    private static Expression? BuildTextFilter(
        MemberExpression propertyAccess,
        DataGridFilterValue filterValue,
        ParameterExpression parameter)
    {
        if (filterValue.Value == null || string.IsNullOrWhiteSpace(filterValue.Value.ToString()))
            return null;

        var operatorName = filterValue.Operator?.ToLower() ?? "contains";
        var searchValue = filterValue.Value.ToString()!.ToLower();

        var propertyType = propertyAccess.Type;
        var isStringType = propertyType == typeof(string);

        // For string properties, use ToLower directly. For other types, convert to string first.
        Expression propertyExpression;
        if (isStringType)
        {
            // Property is already string, just call ToLower
            var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
            propertyExpression = Expression.Call(propertyAccess, toLowerMethod!);
        }
        else
        {
            // For non-string types, convert to string first, then to lower
            // Note: This may not work with EF Core for all types
            var toStringMethod = typeof(object).GetMethod("ToString", Type.EmptyTypes);
            var propertyToString = Expression.Call(propertyAccess, toStringMethod!);
            var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
            propertyExpression = Expression.Call(propertyToString, toLowerMethod!);
        }

        var constant = Expression.Constant(searchValue);

        return operatorName switch
        {
            "contains" => Expression.Call(
                propertyExpression,
                typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                constant),
            "equals" => Expression.Equal(propertyExpression, constant),
            "startswith" => Expression.Call(
                propertyExpression,
                typeof(string).GetMethod("StartsWith", new[] { typeof(string) })!,
                constant),
            "endswith" => Expression.Call(
                propertyExpression,
                typeof(string).GetMethod("EndsWith", new[] { typeof(string) })!,
                constant),
            _ => Expression.Call(
                propertyExpression,
                typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                constant)
        };
    }

    private static Expression? BuildNumberFilter(
        MemberExpression propertyAccess,
        DataGridFilterValue filterValue,
        ParameterExpression parameter)
    {
        if (filterValue.Value == null)
            return null;

        // Handle empty strings - treat as null
        if (filterValue.Value is string strValue && string.IsNullOrWhiteSpace(strValue))
            return null;

        var operatorName = filterValue.Operator?.ToLower() ?? "equals";
        var propertyType = propertyAccess.Type;

        // Convert value to property type
        object? convertedValue = null;
        object? convertedValueTo = null;

        try
        {
            // Helper to extract numeric value from various types (including JsonElement)
            decimal ExtractDecimalValue(object? value)
            {
                if (value == null)
                    throw new ArgumentNullException(nameof(value));

                return value switch
                {
                    decimal d => d,
                    double db => (decimal)db,
                    float f => (decimal)f,
                    int i => i,
                    long l => l,
                    short s => s,
                    byte b => b,
                    JsonElement je when je.ValueKind == JsonValueKind.Number => je.GetDecimal(),
                    JsonElement je when je.ValueKind == JsonValueKind.String => decimal.Parse(je.GetString()!),
                    string str when decimal.TryParse(str, out var parsed) => parsed,
                    _ => Convert.ToDecimal(value)
                };
            }

            if (propertyType == typeof(decimal) || propertyType == typeof(decimal?))
            {
                convertedValue = ExtractDecimalValue(filterValue.Value);
                if (filterValue.ValueTo != null)
                {
                    if (filterValue.ValueTo is string strValueTo && string.IsNullOrWhiteSpace(strValueTo))
                        convertedValueTo = null;
                    else
                        convertedValueTo = ExtractDecimalValue(filterValue.ValueTo);
                }
            }
            else if (propertyType == typeof(double) || propertyType == typeof(double?))
            {
                convertedValue = Convert.ToDouble(filterValue.Value);
                if (filterValue.ValueTo != null)
                {
                    if (filterValue.ValueTo is string strValueTo && string.IsNullOrWhiteSpace(strValueTo))
                        convertedValueTo = null;
                    else
                        convertedValueTo = Convert.ToDouble(filterValue.ValueTo);
                }
            }
            else if (propertyType == typeof(float) || propertyType == typeof(float?))
            {
                convertedValue = Convert.ToSingle(filterValue.Value);
                if (filterValue.ValueTo != null)
                {
                    if (filterValue.ValueTo is string strValueTo && string.IsNullOrWhiteSpace(strValueTo))
                        convertedValueTo = null;
                    else
                        convertedValueTo = Convert.ToSingle(filterValue.ValueTo);
                }
            }
            else if (propertyType == typeof(int) || propertyType == typeof(int?))
            {
                convertedValue = Convert.ToInt32(filterValue.Value);
                if (filterValue.ValueTo != null)
                {
                    if (filterValue.ValueTo is string strValueTo && string.IsNullOrWhiteSpace(strValueTo))
                        convertedValueTo = null;
                    else
                        convertedValueTo = Convert.ToInt32(filterValue.ValueTo);
                }
            }
            else if (propertyType == typeof(long) || propertyType == typeof(long?))
            {
                convertedValue = Convert.ToInt64(filterValue.Value);
                if (filterValue.ValueTo != null)
                {
                    if (filterValue.ValueTo is string strValueTo && string.IsNullOrWhiteSpace(strValueTo))
                        convertedValueTo = null;
                    else
                        convertedValueTo = Convert.ToInt64(filterValue.ValueTo);
                }
            }
            else
            {
                convertedValue = Convert.ChangeType(filterValue.Value, propertyType);
                if (filterValue.ValueTo != null)
                {
                    if (filterValue.ValueTo is string strValueTo && string.IsNullOrWhiteSpace(strValueTo))
                        convertedValueTo = null;
                    else
                        convertedValueTo = Convert.ChangeType(filterValue.ValueTo, propertyType);
                }
            }
        }
        catch
        {
            return null; // Conversion failed
        }

        if (convertedValue == null)
            return null;

        // Handle nullable types - unwrap if needed
        Expression propertyExpression = propertyAccess;
        Type comparisonType = propertyType;

        if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
        {
            // For nullable types, access the Value property
            comparisonType = Nullable.GetUnderlyingType(propertyType)!;
            propertyExpression = Expression.Property(propertyAccess, "Value");
        }

        var constant = Expression.Constant(convertedValue, comparisonType);

        return operatorName switch
        {
            "equals" => Expression.Equal(propertyExpression, constant),
            "notequals" => Expression.NotEqual(propertyExpression, constant),
            "greaterthan" => Expression.GreaterThan(propertyExpression, constant),
            "lessthan" => Expression.LessThan(propertyExpression, constant),
            "greaterorequal" => Expression.GreaterThanOrEqual(propertyExpression, constant),
            "lessorequal" => Expression.LessThanOrEqual(propertyExpression, constant),
            "between" when convertedValueTo != null => BuildBetweenExpression(propertyExpression, convertedValue, convertedValueTo, comparisonType),
            _ => Expression.Equal(propertyExpression, constant)
        };
    }

    private static Expression BuildBetweenExpression(
        Expression propertyAccess,
        object valueFrom,
        object valueTo,
        Type propertyType)
    {
        var constantFrom = Expression.Constant(valueFrom, propertyType);
        var constantTo = Expression.Constant(valueTo, propertyType);

        var greaterThanOrEqual = Expression.GreaterThanOrEqual(propertyAccess, constantFrom);
        var lessThanOrEqual = Expression.LessThanOrEqual(propertyAccess, constantTo);

        return Expression.AndAlso(greaterThanOrEqual, lessThanOrEqual);
    }

    private static Expression? BuildDateFilter(
        MemberExpression propertyAccess,
        DataGridFilterValue filterValue,
        ParameterExpression parameter)
    {
        if (filterValue.Value == null)
            return null;

        var operatorName = filterValue.Operator?.ToLower() ?? "equals";
        DateTime? dateValue = null;
        DateTime? dateValueTo = null;

        try
        {
            if (filterValue.Value is DateTime dt)
                dateValue = dt;
            else if (filterValue.Value is string str && DateTime.TryParse(str, out var parsed))
                dateValue = parsed;

            if (filterValue.ValueTo != null)
            {
                if (filterValue.ValueTo is DateTime dt2)
                    dateValueTo = dt2;
                else if (filterValue.ValueTo is string str2 && DateTime.TryParse(str2, out var parsed2))
                    dateValueTo = parsed2;
            }
        }
        catch
        {
            return null;
        }

        if (!dateValue.HasValue)
            return null;

        var propertyType = propertyAccess.Type;
        var dateTimeType = typeof(DateTime);
        var nullableDateTimeType = typeof(DateTime?);

        // Handle nullable DateTime
        Expression dateProperty = propertyAccess;
        if (propertyType == nullableDateTimeType)
        {
            // For nullable DateTime, we need to compare the Value property
            dateProperty = Expression.Property(propertyAccess, "Value");
        }

        var constant = Expression.Constant(dateValue.Value, dateTimeType);

        return operatorName switch
        {
            "equals" => Expression.Equal(dateProperty, constant),
            "before" => Expression.LessThan(dateProperty, constant),
            "after" => Expression.GreaterThan(dateProperty, constant),
            "between" when dateValueTo.HasValue => BuildBetweenExpression(dateProperty, dateValue.Value, dateValueTo.Value, dateTimeType),
            _ => Expression.Equal(dateProperty, constant)
        };
    }

    private static Expression? BuildSelectFilter(
        MemberExpression propertyAccess,
        DataGridFilterValue filterValue,
        bool isMultiSelect)
    {
        if (isMultiSelect)
        {
            if (filterValue.Values == null || !filterValue.Values.Any())
                return null;

            // For multi-select, use Contains
            var containsMethod = typeof(Enumerable).GetMethods()
                .First(m => m.Name == "Contains" && m.GetParameters().Length == 2)
                .MakeGenericMethod(propertyAccess.Type);

            var listType = typeof(List<>).MakeGenericType(propertyAccess.Type);
            var valuesList = Activator.CreateInstance(listType);
            var addMethod = listType.GetMethod("Add");

            foreach (var value in filterValue.Values)
            {
                try
                {
                    var convertedValue = Convert.ChangeType(value, propertyAccess.Type);
                    addMethod!.Invoke(valuesList, new[] { convertedValue });
                }
                catch
                {
                    // Skip invalid values
                }
            }

            var constant = Expression.Constant(valuesList);
            return Expression.Call(containsMethod, constant, propertyAccess);
        }
        else
        {
            if (filterValue.Value == null)
                return null;

            try
            {
                var convertedValue = Convert.ChangeType(filterValue.Value, propertyAccess.Type);
                var constant = Expression.Constant(convertedValue, propertyAccess.Type);
                return Expression.Equal(propertyAccess, constant);
            }
            catch
            {
                return null;
            }
        }
    }

    private static Expression? BuildBooleanFilter(
        MemberExpression propertyAccess,
        DataGridFilterValue filterValue)
    {
        if (filterValue.Value == null)
            return null;

        bool boolValue;
        if (filterValue.Value is bool b)
            boolValue = b;
        else if (filterValue.Value is string str && bool.TryParse(str, out var parsed))
            boolValue = parsed;
        else if (filterValue.Value.ToString()?.ToLower() == "true")
            boolValue = true;
        else if (filterValue.Value.ToString()?.ToLower() == "false")
            boolValue = false;
        else
            return null;

        var propertyType = propertyAccess.Type;
        Expression boolProperty = propertyAccess;

        // Handle nullable bool
        if (propertyType == typeof(bool?))
        {
            boolProperty = Expression.Property(propertyAccess, "Value");
        }

        var constant = Expression.Constant(boolValue, typeof(bool));
        return Expression.Equal(boolProperty, constant);
    }
}

