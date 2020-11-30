using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class InvestigationDocModel
    {
        public long id { get; set; }
        public long prescription_id { get; set; }
        public long investigation_tag_id { get; set; }
        public long doctor_id { get; set; }
        public long patient_id { get; set; }
        public long investigator_id { get; set; }
        public string name { get; set; }
        public string abbreviation { get; set; }
        public string file_location { get; set; }
        public string file_name { get; set; }
        public DateTime created_date { get; set; }
    }
}
