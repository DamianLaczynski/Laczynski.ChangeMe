using Ardalis.Result;
using Laczynski.ChangeMe.Backend.Domain.Interfaces;

namespace Laczynski.ChangeMe.Backend.IntegrationTests.Support.Fakes;

internal sealed class FakeEmailService : IEmailService
{
  public Task<Result> SendEmailAsync(string to, string subject, string body)
  {
    return Task.FromResult(Result.Success());
  }

  public Task<Result> SendEmailToManyAsync(IEnumerable<string> recipients, string subject, string body)
  {
    return Task.FromResult(Result.Success());
  }
}
