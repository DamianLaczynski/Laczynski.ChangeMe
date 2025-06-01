using System.Net;
using Laczynski.ChangeMe.Backend.Core.Interfaces;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Email;

/// <summary>
/// Konfiguracja serwera SMTP
/// </summary>
public class SmtpSettings
{
  public string Host { get; set; } = string.Empty;
  public int Port { get; set; }
  public bool EnableSsl { get; set; }
  public string Username { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
  public string FromEmail { get; set; } = string.Empty;
  public string FromName { get; set; } = string.Empty;
}

/// <summary>
/// Implementacja usługi email wykorzystująca SMTP
/// </summary>
public class SmtpEmailService : IEmailService
{
  private readonly SmtpSettings _settings;
  private readonly ILogger<SmtpEmailService> _logger;

  /// <summary>
  /// Constructor
  /// </summary>
  public SmtpEmailService(IOptions<SmtpSettings> settings, ILogger<SmtpEmailService> logger)
  {
    _settings = settings.Value;
    _logger = logger;
  }

  /// <inheritdoc />
  public async Task SendEmailAsync(string to, string subject, string body)
  {
    try
    {
      var message = CreateMailMessage(new[] { to }, subject, body);
      await SendMailAsync(message);
      _logger.LogInformation("Email sent successfully to {Recipient}", to);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to send email to {Recipient}: {Error}", to, ex.Message);
      throw;
    }
  }

  /// <inheritdoc />
  public async Task SendEmailToManyAsync(IEnumerable<string> recipients, string subject, string body)
  {
    try
    {
      var message = CreateMailMessage(recipients, subject, body);
      await SendMailAsync(message);
      _logger.LogInformation("Email sent successfully to multiple recipients");
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to send email to multiple recipients: {Error}", ex.Message);
      throw;
    }
  }

  private MailMessage CreateMailMessage(IEnumerable<string> recipients, string subject, string body)
  {
    var message = new MailMessage
    {
      From = new MailAddress(_settings.FromEmail, _settings.FromName),
      Subject = subject,
      Body = body,
      IsBodyHtml = true
    };

    foreach (var recipient in recipients)
    {
      message.To.Add(recipient);
    }

    return message;
  }

  private async Task SendMailAsync(MailMessage message)
  {
    using var client = new SmtpClient(_settings.Host, _settings.Port)
    {
      EnableSsl = _settings.EnableSsl,
      Credentials = new NetworkCredential(_settings.Username, _settings.Password)
    };

    await client.SendMailAsync(message);
  }
}
