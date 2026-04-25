using Ardalis.Result;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UnitTests;

public sealed class IssueTests
{
  [Theory]
  [InlineData("  Sample issue  ", "  Needs details  ", "Sample issue", "Needs details")]
  [InlineData("  Another issue", "Description  ", "Another issue", "Description")]
  public void Create_WhenInputContainsWhitespace_ShouldTrimTitleAndDescription(
    string title,
    string description,
    string expectedTitle,
    string expectedDescription)
  {
    var result = Issue.Create(title, description);

    Assert.True(result.IsSuccess);
    Assert.Equal(expectedTitle, result.Value.Title);
    Assert.Equal(expectedDescription, result.Value.Description);
  }

  [Theory]
  [InlineData("")]
  [InlineData(" ")]
  [InlineData("ab")]
  public void Create_WhenTitleIsInvalid_ShouldReturnInvalidResult(string title)
  {
    var result = Issue.Create(title, "Valid description");

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
  }

  [Theory]
  [InlineData((IssuePriority)999)]
  [InlineData((IssuePriority)(-1))]
  public void Create_WhenPriorityIsInvalid_ShouldReturnInvalidResult(IssuePriority priority)
  {
    var result = Issue.Create("Valid title", "Valid description", priority);

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
  }

  [Theory]
  [InlineData("  Updated title  ", "  Updated description  ", IssuePriority.HIGH, "Updated title", "Updated description")]
  [InlineData("Refined title", null, IssuePriority.CRITICAL, "Refined title", null)]
  public void UpdateDetails_WhenInputIsValid_ShouldUpdateAndTrimValues(
    string title,
    string? description,
    IssuePriority priority,
    string expectedTitle,
    string? expectedDescription)
  {
    var issueResult = Issue.Create("Initial title", "Initial description", IssuePriority.LOW);

    var result = issueResult.Value.UpdateDetails(title, description, priority);

    Assert.True(result.IsSuccess);
    Assert.Equal(expectedTitle, issueResult.Value.Title);
    Assert.Equal(expectedDescription, issueResult.Value.Description);
    Assert.Equal(priority, issueResult.Value.Priority);
  }

  [Theory]
  [InlineData("")]
  [InlineData(" ")]
  [InlineData("ab")]
  public void UpdateDetails_WhenTitleIsInvalid_ShouldReturnInvalidResultAndKeepPreviousValues(string title)
  {
    var issueResult = Issue.Create("Initial title", "Initial description", IssuePriority.MEDIUM);

    var result = issueResult.Value.UpdateDetails(title, "Updated description", IssuePriority.HIGH);

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
    Assert.Equal("Initial title", issueResult.Value.Title);
    Assert.Equal("Initial description", issueResult.Value.Description);
    Assert.Equal(IssuePriority.MEDIUM, issueResult.Value.Priority);
  }

  [Theory]
  [InlineData((IssuePriority)999)]
  [InlineData((IssuePriority)(-1))]
  public void UpdateDetails_WhenPriorityIsInvalid_ShouldReturnInvalidResultAndKeepPreviousValues(IssuePriority priority)
  {
    var issueResult = Issue.Create("Initial title", "Initial description", IssuePriority.MEDIUM);

    var result = issueResult.Value.UpdateDetails("Updated title", "Updated description", priority);

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
    Assert.Equal("Initial title", issueResult.Value.Title);
    Assert.Equal("Initial description", issueResult.Value.Description);
    Assert.Equal(IssuePriority.MEDIUM, issueResult.Value.Priority);
  }

  [Fact]
  public void AddComment_WhenContentIsValid_ShouldAddCommentToCollection()
  {
    var issueResult = Issue.Create("Valid title", "Valid description");

    var result = issueResult.Value.AddComment("First comment");

    Assert.True(result.IsSuccess);
    Assert.Single(issueResult.Value.Comments);
    Assert.Equal("First comment", issueResult.Value.Comments.Single().Content);
  }

  [Fact]
  public void UpdateComment_WhenCommentDoesNotExist_ShouldReturnNotFound()
  {
    var issueResult = Issue.Create("Valid title", "Valid description");

    var result = issueResult.Value.UpdateComment(Guid.NewGuid(), "Updated comment");

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.NotFound, result.Status);
  }

  [Fact]
  public void RemoveComment_WhenCommentDoesNotExist_ShouldReturnNotFound()
  {
    var issueResult = Issue.Create("Valid title", "Valid description");

    var result = issueResult.Value.RemoveComment(Guid.NewGuid());

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.NotFound, result.Status);
  }
}
