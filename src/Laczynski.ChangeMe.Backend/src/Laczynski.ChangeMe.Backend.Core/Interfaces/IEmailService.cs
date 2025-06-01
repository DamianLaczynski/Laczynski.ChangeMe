namespace Laczynski.ChangeMe.Backend.Core.Interfaces;

/// <summary>
/// Interface for sending emails.
/// </summary>
public interface IEmailService
{
  /// <summary>
  /// Sends an email to a single recipient.
  /// </summary>
  /// <param name="to">The email address of the recipient.</param>
  /// <param name="subject">The subject of the email.</param>
  /// <param name="body">The body of the email.</param>
  Task SendEmailAsync(string to, string subject, string body);

  /// <summary>
  /// Sends an email to multiple recipients.
  /// </summary>
  /// <param name="recipients">The list of email addresses of the recipients.</param>
  /// <param name="subject">The subject of the email.</param>
  /// <param name="body">The body of the email.</param>
  /// <returns>An asynchronous task.</returns>
  Task SendEmailToManyAsync(IEnumerable<string> recipients, string subject, string body);
}
