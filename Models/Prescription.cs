using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class Prescription
    {
        public long Id { get; set; }
        public long DoctorId { get; set; }
        public long PatientId { get; set; }
        public long AppointmentId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime ModifiedDate { get; set; }
        public List<PrescriptionPatientComplain> PatientComplains { get; set; }
        public List<PrescriptionPatientExamination> Examinations { get; set; }
        public List<PrescriptionNote> Notes { get; set; }
    }
}
