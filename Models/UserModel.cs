using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class UserModel
    {
        public long? id { get; set; }
        public string name { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public string gender { get; set; }
        public string role { get; set; }
        public IEnumerable<string> roles { get; set; }
        public int? age { get; set; }
        public string country_name { get; set; }
        public string country_short_name { get; set; }
        public int? country_phone_code { get; set; }
        public string state_name { get; set; }
        public string city_name { get; set; }
        public string bloodGroup { get; set; }
        public string bmdc_certifcate { get; set; }
        public IFormFile profilePic { get; set; }
    }
}
