using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class PatientDocumentModel
    {
        public long id { get; set; }
        public string name { get; set; }
        public long patient_id { get; set; }
        
        public UserModel patient { get; set; }
        public DateTime created_date { get; set; }
        
        public string document_link { get; set; }
        public IFormFile document { get; set; }
    }
}
