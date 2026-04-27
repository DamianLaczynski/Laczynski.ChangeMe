using Ardalis.Result;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Entities;

namespace Laczynski.ChangeMe.Backend.UnitTests;

public sealed class IssueAcceptanceCriterionTests
{
  [Theory]
  [InlineData("")]
  [InlineData(" ")]
  public void Create_WhenContentIsEmpty_ShouldReturnInvalidResult(string content)
  {
    var result = IssueAcceptanceCriterion.Create(Guid.NewGuid(), content);

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
  }

  [Theory]
  [InlineData("  Acceptance criterion body  ", "Acceptance criterion body")]
  [InlineData("Acceptance criterion", "Acceptance criterion")]
  public void UpdateContent_WhenContentIsValid_ShouldTrimAndUpdateValue(string content, string expected)
  {
    var acceptanceCriterionResult = IssueAcceptanceCriterion.Create(Guid.NewGuid(), "Initial acceptance criterion");

    var result = acceptanceCriterionResult.Value.UpdateContent(content);

    Assert.True(result.IsSuccess);
    Assert.Equal(expected, acceptanceCriterionResult.Value.Content);
  }
}
