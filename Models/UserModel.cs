using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class UserModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Role { get; set; }
        public IEnumerable<string> Roles { get; set; }
        public int Age { get; set; }
        public string country_name { get; set; }
        public string country_short_name { get; set; }
        public int country_phone_code { get; set; }
        public string state_name { get; set; }
        public string city_name { get; set; }
        public string bloodGroup { get; set; }
        public string bmdc_certifcate { get; set; }

        public byte[] profilePic { get; set; }
    }
}
