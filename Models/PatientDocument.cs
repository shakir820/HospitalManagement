using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class PatientDocument
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public string DocumentLocation { get; set; }
        public long PatientId { get; set; }
        public string ContentType { get; set; }


    }
}
