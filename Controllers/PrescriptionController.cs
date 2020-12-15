using HospitalManagement.Data;
using HospitalManagement.Helper;
using HospitalManagement.Models;
using HospitalManagement.Models.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HospitalManagement.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        HospitalManagementDbContext _context;
        UserManager<User> _userManager;
        RoleManager<UserRole> _roleManager;
        SignInManager<User> _signInManager;
        IWebHostEnvironment _webHostEnvironment;


        public PrescriptionController(
            HospitalManagementDbContext context,
            UserManager<User> userManager,
            RoleManager<UserRole> roleManager,
            SignInManager<User> signInManager,
            IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _webHostEnvironment = webHostEnvironment;
        }






        [HttpPost]
        public async Task<IActionResult> CreateNewPrescription(PostMethodRawData pres)
        {

            PrescriptionModel prescription = JsonConvert.DeserializeObject<PrescriptionModel>(pres.json_data);

            //Thread.Sleep(3000);
            //return new JsonResult(new
            //{
            //    success = false,
            //    error = true,
            //    error_msg = "The prescription is already created! You cannot create new prescription on this appointment"
            //});

            using (var transsaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var appointment = await _context.DoctorAppointments.FirstOrDefaultAsync(a => a.Id == prescription.appointment.id);
                    if (appointment.Consulted == true)
                    {
                        return new JsonResult(new
                        {
                            success = false,
                            error = false,
                            error_msg = "The prescription is already created! You cannot create new prescription on this appointment"
                        });
                    }



                    var today = DateTime.Now;
                    var p = new Prescription();
                    p.AppointmentId = prescription.appointment.id;
                    p.CreatedDate = today;
                    p.DoctorId = (long)prescription.doctor.id;
                    p.PatientId = (long)prescription.patient.id;



                    if (prescription.patient_examinations != null && prescription.patient_examinations.Count > 0)
                    {
                        p.Examinations = new List<PrescriptionPatientExamination>();
                        foreach (var item in prescription.patient_examinations)
                        {
                            var examination = new PrescriptionPatientExamination();
                            examination.CreatedDate = today;
                            examination.Description = item.description;
                            examination.Title = item.title;
                            p.Examinations.Add(examination);
                        }
                    }


                    if (prescription.notes != null && prescription.notes.Count > 0)
                    {
                        p.Notes = new List<PrescriptionNote>();
                        foreach (var item in prescription.notes)
                        {
                            var note = new PrescriptionNote();
                            note.Note = item.note;
                            p.Notes.Add(note);
                        }
                    }

                    if (prescription.patient_complains != null && prescription.patient_complains.Count > 0)
                    {
                        p.PatientComplains = new List<PrescriptionPatientComplain>();
                        foreach (var item in prescription.patient_complains)
                        {
                            var com = new PrescriptionPatientComplain();
                            com.Description = item.description;
                            com.Title = item.title;
                            p.PatientComplains.Add(com);
                        }
                    }

                    _context.Prescriptions.Add(p);
                    await _context.SaveChangesAsync();


                    if (prescription.patient_investigations != null && prescription.patient_investigations.Count > 0)
                    {
                        foreach (var item in prescription.patient_investigations)
                        {
                            var investigation = new InvestigationDoc();
                            investigation.Abbreviation = item.abbreviation;
                            investigation.CreatedDate = today;
                            investigation.DoctorId = (long)prescription.doctor.id;
                            investigation.InvestigationTagId = item.investigation_tag_id;
                            investigation.Name = item.name;
                            investigation.PatientId = (long)item.patient.id;
                            investigation.PrescriptionId = p.Id;

                            _context.InvestigationDocs.Add(investigation);
                            await _context.SaveChangesAsync();
                        }
                    }

                    if (prescription.medicines != null && prescription.medicines.Count > 0)
                    {
                        foreach (var item in prescription.medicines)
                        {
                            var medicine = new PrescriptionMedicine();
                            medicine.CreatedDate = today;
                            medicine.DoctorId = (long)prescription.doctor.id;
                            medicine.Duration = item.duration;
                            medicine.MedicineId = item.medicine_id;
                            medicine.Note = item.note;
                            medicine.PatientId = (long)prescription.patient.id;
                            medicine.PrescriptionId = p.Id;
                            medicine.Schedule = item.schedule;

                            _context.PrescriptionMedicines.Add(medicine);
                            await _context.SaveChangesAsync();
                        }
                    }

                    appointment.Consulted = true;
                    await _context.SaveChangesAsync();


                    await transsaction.CommitAsync();

                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        prescription_id = p.Id
                    });
                }
                catch (Exception ex)
                {
                    await transsaction.RollbackAsync();

                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = ex.Message
                    });
                }

            }
        }







        public async Task<IActionResult> CanCreatePrescription(long appointment_id)
        {
            try
            {
                var cca = false;
                var appointment = await _context.DoctorAppointments.AsNoTracking().FirstOrDefaultAsync(a => a.Id == appointment_id);
                if (appointment != null)
                {
                    if (appointment.Consulted)
                    {
                        cca = false;
                    }
                    else
                    {
                        cca = true;
                    }
                }
                else
                {
                    cca = false;
                }


                return new JsonResult(new
                {
                    can_create_prescription = cca
                });
            }
            catch (Exception)
            {
                return new JsonResult(new
                {
                    can_create_prescription = false
                });
            }
        }






        public async Task<IActionResult> EditPrescription(PostMethodRawData post_method_data)
        {
            PrescriptionModel prescription = JsonConvert.DeserializeObject<PrescriptionModel>(post_method_data.json_data);


            using (var transsaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    #region prescription delete
                    var _pres = await _context.Prescriptions.Include(a => a.Examinations).Include(a => a.Notes).
                        Include(a => a.PatientComplains).FirstOrDefaultAsync(a => a.Id == prescription.id);
                    var _pres_medicines = await _context.PrescriptionMedicines.Where(a => a.PrescriptionId == _pres.Id).ToListAsync();
                    var _pres_investigations = await _context.InvestigationDocs.Where(a => a.PrescriptionId == _pres.Id).ToListAsync();

                    _context.Prescriptions.Remove(_pres);
                    await _context.SaveChangesAsync();

                    _context.PrescriptionMedicines.RemoveRange(_pres_medicines);
                    await _context.SaveChangesAsync();

                    _context.InvestigationDocs.RemoveRange(_pres_investigations);
                    await _context.SaveChangesAsync();
                    #endregion



                    var appointment = await _context.DoctorAppointments.FirstOrDefaultAsync(a => a.Id == prescription.appointment.id);

                    var today = DateTime.Now;
                    var p = new Prescription();
                    p.AppointmentId = prescription.appointment.id;
                    p.CreatedDate = today;
                    p.DoctorId = (long)prescription.doctor.id;
                    p.PatientId = (long)prescription.patient.id;



                    if (prescription.patient_examinations != null && prescription.patient_examinations.Count > 0)
                    {
                        p.Examinations = new List<PrescriptionPatientExamination>();
                        foreach (var item in prescription.patient_examinations)
                        {
                            var examination = new PrescriptionPatientExamination();
                            examination.CreatedDate = today;
                            examination.Description = item.description;
                            examination.Title = item.title;
                            p.Examinations.Add(examination);
                        }
                    }


                    if (prescription.notes != null && prescription.notes.Count > 0)
                    {
                        p.Notes = new List<PrescriptionNote>();
                        foreach (var item in prescription.notes)
                        {
                            var note = new PrescriptionNote();
                            note.Note = item.note;
                            p.Notes.Add(note);
                        }
                    }

                    if (prescription.patient_complains != null && prescription.patient_complains.Count > 0)
                    {
                        p.PatientComplains = new List<PrescriptionPatientComplain>();
                        foreach (var item in prescription.patient_complains)
                        {
                            var com = new PrescriptionPatientComplain();
                            com.Description = item.description;
                            com.Title = item.title;
                            p.PatientComplains.Add(com);
                        }
                    }

                    _context.Prescriptions.Add(p);
                    await _context.SaveChangesAsync();


                    if (prescription.patient_investigations != null && prescription.patient_investigations.Count > 0)
                    {
                        foreach (var item in prescription.patient_investigations)
                        {
                            var investigation = new InvestigationDoc();
                            investigation.Abbreviation = item.abbreviation;
                            investigation.CreatedDate = today;
                            investigation.DoctorId = (long)prescription.doctor.id;
                            investigation.InvestigationTagId = item.investigation_tag_id;
                            investigation.Name = item.name;
                            investigation.PatientId = (long)item.patient.id;
                            investigation.PrescriptionId = p.Id;

                            _context.InvestigationDocs.Add(investigation);
                            await _context.SaveChangesAsync();
                        }
                    }

                    if (prescription.medicines != null && prescription.medicines.Count > 0)
                    {
                        foreach (var item in prescription.medicines)
                        {
                            var medicine = new PrescriptionMedicine();
                            medicine.CreatedDate = today;
                            medicine.DoctorId = (long)prescription.doctor.id;
                            medicine.Duration = item.duration;
                            medicine.MedicineId = item.medicine_id;
                            medicine.Note = item.note;
                            medicine.PatientId = (long)prescription.patient.id;
                            medicine.PrescriptionId = p.Id;
                            medicine.Schedule = item.schedule;

                            _context.PrescriptionMedicines.Add(medicine);
                            await _context.SaveChangesAsync();
                        }
                    }

                    appointment.Consulted = true;
                    await _context.SaveChangesAsync();


                    await transsaction.CommitAsync();

                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        prescription_id = p.Id
                    });
                }
                catch (Exception ex)
                {
                    await transsaction.RollbackAsync();

                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = ex.Message
                    });
                }

            }
        }






        public async Task<IActionResult> GetPrescriptionByAppointmentId(long appointment_id)
        {
            try
            {
                var pres_patient_doctor = await _context.Prescriptions.Include(a => a.Examinations).Include(a => a.Notes).Include(a => a.PatientComplains).
                    Join(_context.Users, outter => outter.PatientId, inner => inner.Id, (outter, inner) => new { pres = outter, patient = inner }).
                    Join(_context.Users, outter => outter.pres.DoctorId, inner => inner.Id, (outter, inner) => new { pres_patient = outter, doctor = inner }).
                    AsNoTracking().FirstOrDefaultAsync(a => a.pres_patient.pres.AppointmentId == appointment_id);

                if (pres_patient_doctor != null)
                {
                    var p_medicines = await _context.PrescriptionMedicines.Join(_context.Medicines, outter => outter.MedicineId, inner => inner.Id,
                        (outter, inner) => new { pre_medicine = outter, medicine = inner }).AsNoTracking().
                        Where(a => a.pre_medicine.PrescriptionId == pres_patient_doctor.pres_patient.pres.Id).ToListAsync();

                    var p_investigations = await _context.InvestigationDocs.AsNoTracking().Where(a => a.PrescriptionId == pres_patient_doctor.pres_patient.pres.Id).ToListAsync();


                    var prescription = new PrescriptionModel();
                    var patient = pres_patient_doctor.pres_patient.patient;
                    var doctor = pres_patient_doctor.doctor;
                    var pres = pres_patient_doctor.pres_patient.pres;

                    prescription.appointment = new DoctorAppointmentModel();
                    prescription.appointment.id = appointment_id;
                    prescription.created_date = pres.CreatedDate;
                    prescription.doctor = ModelBindingResolver.ResolveUser(doctor);


                    prescription.id = pres.Id;
                    prescription.medicines = new List<PrescriptionMedicineModel>();

                    if (p_medicines.Count > 0)
                    {
                        foreach (var item in p_medicines)
                        {
                            var medicine = new PrescriptionMedicineModel();
                            medicine.doctor_id = item.pre_medicine.DoctorId;
                            medicine.duration = item.pre_medicine.Duration;
                            medicine.id = item.pre_medicine.Id;
                            medicine.medicine_id = item.pre_medicine.MedicineId;
                            medicine.note = item.pre_medicine.Note;
                            medicine.patient_id = item.pre_medicine.PatientId;
                            medicine.prescription_id = item.pre_medicine.PrescriptionId;
                            medicine.schedule = item.pre_medicine.Schedule;
                            medicine.title = item.medicine.Name;

                            prescription.medicines.Add(medicine);
                        }
                    }

                    prescription.notes = new List<PrescriptionNoteModel>();
                    if (pres.Notes.Count > 0)
                    {
                        foreach (var item in pres.Notes)
                        {
                            var note = new PrescriptionNoteModel();
                            note.id = item.Id;
                            note.note = item.Note;
                            prescription.notes.Add(note);
                        }
                    }

                    prescription.patient = ModelBindingResolver.ResolveUser(patient);

                    prescription.patient_complains = new List<PrescriptionPatientComplainModel>();
                    foreach (var item in pres.PatientComplains)
                    {
                        var com = new PrescriptionPatientComplainModel();
                        com.description = item.Description;
                        com.id = item.Id;
                        com.title = item.Title;

                        prescription.patient_complains.Add(com);
                    }

                    prescription.patient_examinations = new List<PrescriptionPatientExaminationModel>();

                    foreach (var item in pres.Examinations)
                    {
                        var examination = new PrescriptionPatientExaminationModel();
                        examination.description = item.Description;
                        examination.id = item.Id;
                        examination.title = item.Title;

                        prescription.patient_examinations.Add(examination);
                    }

                    prescription.patient_investigations = new List<InvestigationDocModel>();

                    foreach (var item in p_investigations)
                    {
                        UserModel investigator = null;

                        var db_investigator = await _context.Users.FirstOrDefaultAsync(a => a.Id == item.InvestigatorId);
                        if(db_investigator != null)
                        {
                            investigator = ModelBindingResolver.ResolveUser(db_investigator);
                        }
                        
                        var investigation = ModelBindingResolver.ResolveInvestigationDoc(item, prescription.doctor, prescription.patient, investigator);
                        investigation.file_location = Url.Content($"~/api/Investigation/GetInvestigationFile?investigation_id={investigation.id}");

                        prescription.patient_investigations.Add(investigation);
                    }


                    return new JsonResult(new
                    {
                        success = true,
                        error = false,
                        prescription
                    });

                }
                else
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "Prescription is not found!"
                    });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }



        public async Task<IActionResult> GetPrescriptionListByPatientId(long patient_id)
        {
            try
            {
                var pres_list = await _context.Prescriptions.Join(_context.Users, outter => outter.DoctorId, inner => inner.Id, (outter, inner) => new
                {
                    pres = outter,
                    doc = inner
                }).AsNoTracking().Where(a => a.pres.PatientId == patient_id).ToListAsync();


                var prescription_list = new List<PrescriptionModel>();

                foreach(var item in pres_list)
                {
                    var p = ModelBindingResolver.ResolvePrescription(item.pres);
                    p.doctor = ModelBindingResolver.ResolveUser(item.doc);

                    prescription_list.Add(p);
                }

                return new JsonResult(new
                {
                    success = true,
                    error = false,
                    prescription_list
                });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
            

        }




        public async Task<IActionResult> GetPrescriptionById(long prescription_id)
        {
            try
            {
                var pres_patient_doctor = await _context.Prescriptions.Include(a => a.Examinations).Include(a => a.Notes).Include(a => a.PatientComplains).
                  Join(_context.Users, outter => outter.PatientId, inner => inner.Id, (outter, inner) => new { pres = outter, patient = inner }).
                  Join(_context.Users, outter => outter.pres.DoctorId, inner => inner.Id, (outter, inner) => new { pres_patient = outter, doctor = inner }).
                  AsNoTracking().FirstOrDefaultAsync(a => a.pres_patient.pres.Id == prescription_id);


                if (pres_patient_doctor == null)
                {
                    return new JsonResult(new
                    {
                        success = false,
                        error = true,
                        error_msg = "Prescription not found"
                    });
                }



                var p_medicines = await _context.PrescriptionMedicines.Join(_context.Medicines, outter => outter.MedicineId, inner => inner.Id,
                       (outter, inner) => new { pre_medicine = outter, medicine = inner }).AsNoTracking().
                       Where(a => a.pre_medicine.PrescriptionId == pres_patient_doctor.pres_patient.pres.Id).ToListAsync();

                var p_investigations = await _context.InvestigationDocs.AsNoTracking().Where(a => a.PrescriptionId == pres_patient_doctor.pres_patient.pres.Id).ToListAsync();





              


                var p = pres_patient_doctor.pres_patient.pres;
                var doctor = pres_patient_doctor.doctor;
                var patient = pres_patient_doctor.pres_patient.patient;
                var investigations = p_investigations;
                var medicines = p_medicines;

                var pres = ModelBindingResolver.ResolvePrescription(p);
                pres.doctor = ModelBindingResolver.ResolveUser(doctor);
                pres.medicines = new List<PrescriptionMedicineModel>();
                
                foreach(var item in medicines)
                {
                    var m = new PrescriptionMedicineModel();
                    m.doctor_id = item.pre_medicine.DoctorId;
                    m.duration = item.pre_medicine.Duration;
                    m.id = item.pre_medicine.Id;
                    m.medicine_id = item.medicine.Id;
                    m.note = item.pre_medicine.Note;
                    m.patient_id = item.pre_medicine.PatientId;
                    m.prescription_id = item.pre_medicine.PrescriptionId;
                    m.schedule = item.pre_medicine.Schedule;
                    m.title = item.medicine.Name;

                    pres.medicines.Add(m);
                }

                pres.patient = ModelBindingResolver.ResolveUser(patient);
                pres.patient_investigations = new List<InvestigationDocModel>();

                foreach(var item in investigations)
                {
                    var db_investigator = await _context.Users.FirstOrDefaultAsync(a => a.Id == item.InvestigatorId);
                    UserModel investigator = null;
                    if(db_investigator != null)
                    {
                        investigator = ModelBindingResolver.ResolveUser(db_investigator);
                        
                    }
                    var investigation = ModelBindingResolver.ResolveInvestigationDoc(item, pres.doctor, pres.patient, investigator);
                    investigation.file_location = Url.Content($"~/api/Investigation/GetInvestigationFile?investigation_id={investigation.id}");
                  
                    pres.patient_investigations.Add(investigation);
                }



                return new JsonResult(new
                {
                    prescription = pres,
                    success = true,
                    error = false
                });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    success = false,
                    error = true,
                    error_msg = ex.Message
                });
            }
        }



    }
}
