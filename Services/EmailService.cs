using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Services
{
    public class EmailService
    {
     
        public EmailService()
        {
           
        }

        public async void SendEmailAsync(string email_subject, string msg_body, List<string> email_to)
        {
            MimeMessage _message = new MimeMessage();

            MailboxAddress from = new MailboxAddress("SKT Hospital",
            "skthospital@gmail.com");
            _message.From.Add(from);

       
            foreach (var item in email_to)
            {
                MailboxAddress mailbox = new MailboxAddress(item);
                _message.To.Add(mailbox);
            }


            _message.Subject = email_subject;
            BodyBuilder bodyBuilder = new BodyBuilder();
            bodyBuilder.TextBody = msg_body;
            _message.Body = bodyBuilder.ToMessageBody();


            SmtpClient _client = new SmtpClient();

            await _client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            await _client.AuthenticateAsync("skthospital@gmail.com", "skt_hospital_820");

            await _client.SendAsync(_message);
            await _client.DisconnectAsync(true);
            _client.Dispose();
        }

      
    }
}
