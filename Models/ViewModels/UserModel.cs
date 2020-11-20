using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
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
        public List<string> roles { get; set; }
        public int? age { get; set; }
        public string country_name { get; set; }
        public string country_short_name { get; set; }
        public int? country_phone_code { get; set; }
        public string state_name { get; set; }
        public string city_name { get; set; }
        public string bloodGroup { get; set; }
        public IFormFile profilePic { get; set; }
        public bool isActive { get; set; }






        // doctor's info
        public bool approved { get; set; } = false;
        public string bmdc_certifcate { get; set; }
        public string doctor_title { get; set; }
        public string degree_title { get; set; }
        public string biography { get; set; }
        
        
        public List<SpecialityTagModel> specialities { get; set; }
        public string specialities_json { get; set; }
        
        
        public int experience { get; set; }
        public string types_of { get; set; }
        
        
        public List<LanguageTagModel> languages { get; set; }
        public string languages_json { get; set; }
        

        public List<ScheduleModel> schedules { get; set; }
        public string schedules_json { get; set; }


        public decimal new_patient_visiting_price { get; set; }
        //gets old after 3 months
        public decimal old_patient_visiting_price { get; set; }

    }
}
