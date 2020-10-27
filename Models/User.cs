using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class User:IdentityUser<long>
    {
        public string Name { get; set; }
        public string Gender { get; set; }
        public int? Age { get; set; }
        public string country_name { get; set; }
        public string country_short_name { get; set; }
        public int? country_phone_code { get; set; }
        public string state_name { get; set; }
        public string city_name { get; set; }
        public string BloodGroup { get; set; }
        public string BMDC_certifcate { get; set; }
        public bool Approved { get; set; } = false;
        public byte[] ProfilePic { get; set; }

    }
}
