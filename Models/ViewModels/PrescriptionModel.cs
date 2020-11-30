
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models.ViewModels
{
    public class PrescriptionModel
    {
        public long id { get; set; }
        public DoctorAppointmentModel appointment { get; set; }
        public UserModel patient { get; set; }
        public UserModel doctor { get; set; }

        public DateTime created_date { get; set; } = DateTime.Now;
        public DateTime modified_date { get; set; }
        public List<PrescriptionPatientComplainModel> patient_complains { get; set; }
        public List<PrescriptionPatientExaminationModel> patient_examinations { get; set; }
        public List<InvestigationDocModel> patient_investigations { get; set; }
        public List<PrescriptionMedicineModel> medicines { get; set; }
        public List<PrescriptionNoteModel> notes { get; set; }
    }
}
