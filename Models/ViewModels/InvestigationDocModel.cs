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
        public string name { get; set; }
        public string abbreviation { get; set; }
        public string file_location { get; set; }
        public string file_name { get; set; }
        public DateTime created_date { get; set; }
        public DateTime result_publish_date { get; set; }
        public DateTime sample_submit_date { get; set; }

        public UserModel doctor { get; set; }
        public UserModel patient { get; set; }
        public UserModel investigator { get; set; }
        public InvestigationStatus investigation_status { get; set; }


    }
}
