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
        public byte[] ProfilePic { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;

        public string Address { get; set; }


        //doctor's profile info
        public string DoctorTitle { get; set; }
        public string DegreeTittle { get; set; }
        public string Biography { get; set; }
        public string BMDC_certifcate { get; set; }
        public bool Approved { get; set; } = false;
        public List<SelectedSpecialityTag> Specialities { get; set; }
        public int year_of_Experience { get; set; }
        public string TypesOf { get; set; }
        public List<SelectedLanguage> Languages { get; set; }
        public List<Schedule> Schedules { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal NewPatientVisitingPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        //gets old after 3 months
        public decimal OldPatientVisitingPrice { get; set; }

       

    }
}
