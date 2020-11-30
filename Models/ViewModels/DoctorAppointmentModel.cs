using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class DoctorAppointmentModel
    {
        public long id { get; set; }
        public long patient_id { get; set; }
        public long doctor_id { get; set; }
        public long serial_no { get; set; }
        public string patient_name { get; set; }
        public string doctor_name { get; set; }
        public bool consulted { get; set; }
        public decimal visiting_price { get; set; }
        public DateTime appointment_date { get; set; }
        public string appointment_date_str { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        public DateTime created_date { get; set; }
        public DateTime modified_date { get; set; }
    }
}
