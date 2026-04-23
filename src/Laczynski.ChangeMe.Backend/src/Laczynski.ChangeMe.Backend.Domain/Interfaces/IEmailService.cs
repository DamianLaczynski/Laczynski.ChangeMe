namespace Laczynski.ChangeMe.Backend.Domain.Interfaces;

public interface IEmailService
{
    Task<Result> SendEmailAsync(string to, string subject, string body);
    Task<Result> SendEmailToManyAsync(IEnumerable<string> recipients, string subject, string body);
}