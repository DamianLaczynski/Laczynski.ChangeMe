using Ardalis.Result;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Entities;

namespace Laczynski.ChangeMe.Backend.UnitTests;

public sealed class IssueCommentTests
{
  [Theory]
  [InlineData("")]
  [InlineData(" ")]
  public void Create_WhenContentIsEmpty_ShouldReturnInvalidResult(string content)
  {
    var result = IssueComment.Create(Guid.NewGuid(), content);

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
  }

  [Theory]
  [InlineData("  Comment body  ", "Comment body")]
  [InlineData("Comment", "Comment")]
  public void UpdateContent_WhenContentIsValid_ShouldTrimAndUpdateValue(string content, string expected)
  {
    var commentResult = IssueComment.Create(Guid.NewGuid(), "Initial comment");

    var result = commentResult.Value.UpdateContent(content);

    Assert.True(result.IsSuccess);
    Assert.Equal(expected, commentResult.Value.Content);
  }
}
