using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HospitalManagement.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NuGet.Frameworks;

namespace HospitalManagement.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        IConfiguration _config;

        public LoginController(IConfiguration configuration)
        {
            _config = configuration;
        }



        [HttpGet]
        public IActionResult Login(string username, string pass)
        {
            var login = new UserModel();
            login.Username = username;
            login.Password = pass;

            IActionResult response = Unauthorized();
            var user = AuthenticateUser(login);

            if(user != null)
            {
                var tokenStr = GenerateJsonWebToken(user);
                response = Ok(new { token = tokenStr });
            }

            return response;
        }


        private UserModel AuthenticateUser(UserModel login)
        {
            UserModel user = null;
            if(login.Username == "shakir" && login.Password == "123")
            {
                user = new UserModel 
                { 
                    Username = login.Username, 
                    Password = login.Password, 
                    EmailAddress = "shakir.sha95@gmail.com", 
                    Name = "Shakir Ahmed" 
                };
            }
            return user;
        }




        private string GenerateJsonWebToken(UserModel userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userInfo.Name)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: credentials);


            var encodeToken = new JwtSecurityTokenHandler().WriteToken(token);
            return encodeToken;
        }


        [Authorize]
        [HttpPost]
        public string Post()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            IList<Claim> claims = identity.Claims.ToList();
            var userName = claims[0].Value;

            return "Welcome to " + userName;

        }
    }
}
