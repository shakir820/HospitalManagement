using HospitalManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Data
{
    public static class SeedDatabase
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new HospitalManagementDbContext(serviceProvider.GetRequiredService<DbContextOptions<HospitalManagementDbContext>>()))
            {
                if (!context.InvestigationTags.Any())
                {
                    context.InvestigationTags.AddRange(
                   new Models.InvestigationTag
                   {
                       Abbreviation = "A1A",
                       Name = "Alpha-1 Antitrypsin"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "A1c",
                       Name = "Hemoglobin A1c"
                   },


                   new Models.InvestigationTag
                   {
                       Abbreviation = "AB",
                       Name = "Antibody"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ABG",
                       Name = "Arterial Blood Gas"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ABRH ",
                       Name = "ABO Group and Rh Type"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ABT",
                       Name = "Antibody Titer"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ACA",
                       Name = "Anti-Cardiolipin Antibodies"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ACE",
                       Name = "Angiotensin Converting Enzyme"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ACID PHOS",
                       Name = "Acid Phosphatase"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ACP",
                       Name = "Acid Phosphatase"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ACT",
                       Name = "Activated Clotting Time"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ACTH",
                       Name = "Adrenocorticotropic Hormone"
                   },


                   new Models.InvestigationTag
                   {
                       Abbreviation = "ADA",
                       Name = "Adenosine Deaminase"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "AFB",
                       Name = "Acid-Fast Bacillus"
                   },


                   new Models.InvestigationTag
                   {
                       Abbreviation = "AFP",
                       Name = "Alpha Fetoprotein"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "AG",
                       Name = "Antigen"
                   },

                   new Models.InvestigationTag
                   {
                       Abbreviation = "ALA",
                       Name = "Aminolevulinic Acid"
                   },



                   new Models.InvestigationTag
                   {
                       Abbreviation = "Alb",
                       Name = "Albumin"
                   },


                   new Models.InvestigationTag
                   {
                       Abbreviation = "Alk Phos",
                       Name = "Alkaline Phosphatase"
                   }
                   );
                    context.SaveChanges();
                }

                if (!context.Languages.Any())
                {
                    context.Languages.AddRange(
                        new Models.Language
                        {
                            LanguageName = "English"
                        },

                        new Models.Language
                        {
                            LanguageName = "Mandarin Chinese"
                        },
                        new Models.Language
                        {
                            LanguageName = "Hindi"
                        },
                        new Models.Language
                        {
                            LanguageName = "Spanish"
                        },
                        new Models.Language
                        {
                            LanguageName = "French"
                        },
                        new Models.Language
                        {
                            LanguageName = "Arabic"
                        },

                        new Models.Language
                        {
                            LanguageName = "Bengali"
                        },

                        new Models.Language
                        {
                            LanguageName = "Russian"
                        },

                        new Models.Language
                        {
                            LanguageName = "Portuguese"
                        },

                        new Models.Language
                        {
                            LanguageName = "Indonesian"
                        },

                        new Models.Language
                        {
                            LanguageName = "Urdu"
                        },

                        new Models.Language
                        {
                            LanguageName = "German"
                        },

                        new Models.Language
                        {
                            LanguageName = "Japanese"
                        },

                        new Models.Language
                        {
                            LanguageName = "Swahili"
                        },

                        new Models.Language
                        {
                            LanguageName = "Marathi"
                        },

                        new Models.Language
                        {
                            LanguageName = "Telugu"
                        },
                        new Models.Language
                        {
                            LanguageName = "Western Punjabi"
                        },
                        new Models.Language
                        {
                            LanguageName = "Wu Chinese"
                        },
                        new Models.Language
                        {
                            LanguageName = "Tamil"
                        },
                        new Models.Language
                        {
                            LanguageName = "Turkish"
                        });
                    context.SaveChanges();
                }

                if (!context.Specialities.Any())
                {
                    context.Specialities.AddRange(
                        new Models.Speciality
                        {
                            SpecialityName = "Addiction psychiatrist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Adolescent medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Allergist (immunologist)"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Anesthesiologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Cardiac electrophysiologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Cardiologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Cardiovascular surgeon"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Colon and rectal surgeon"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Critical care medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Dermatologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Developmental pediatrician"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Emergency medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Endocrinologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Family medicine physician"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Forensic pathologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Gastroenterologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Geriatric medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Gynecologist"
                        },
                        new Models.Speciality
                        {
                            SpecialityName = "Gynecologic oncologist"
                        },
                        new Models.Speciality
                        {
                            SpecialityName = "Hand surgeon"
                        },
                        new Models.Speciality
                        {
                            SpecialityName = "Hematologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Hepatologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Hospitalist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Hospice and palliative medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Hyperbaric physician"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Infectious disease specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Internist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Interventional cardiologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Medical examiner"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Medical geneticist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Neonatologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Nephrologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Neurological surgeon"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Neurologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Nuclear medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Obstetrician"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Occupational medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Medical oncologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Ophthalmologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Oral surgeon (maxillofacial surgeon)"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Orthopedic surgeon"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Ear, Nose, and Throat Specialist (Otolaryngologist)"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Pain management specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Pathologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Pediatrician"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Perinatologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Physiatrist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Plastic surgeon"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Psychiatrist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Pulmonologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Radiation oncologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Radiologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Reproductive endocrinologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Rheumatologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Sleep disorders specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Spinal cord injury specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Sports medicine specialist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Surgeon"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Thoracic surgeon"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Urologist"
                        },

                        new Models.Speciality
                        {
                            SpecialityName = "Vascular surgeon"
                        }

                        );

                    context.SaveChanges();
                }

                if (!context.Medicines.Any())
                {
                    var medicines = new Medicine[] 
                    { 
                        new Medicine 
                        { 
                            Name = "Camlodin Plus 50gm",
                            Description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
                            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an " +
                            "unknown printer took a galley of type and scrambled it to make a type specimen book",
                            MedicineLink = @"https://medex.com.bd/brands/822/camlodin-plus-5mg"
                        },

                        new Medicine
                        {
                            Name = "Napa 500gm",
                            Description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
                            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an " +
                            "unknown printer took a galley of type and scrambled it to make a type specimen book",
                            MedicineLink = @"https://medex.com.bd/brands/10452/napa-500mg"
                        },

                        new Medicine
                        {
                            Name = "Histacin 4mg",
                            Description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
                            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an " +
                            "unknown printer took a galley of type and scrambled it to make a type specimen book",
                            MedicineLink = @"https://medex.com.bd/brands/11819/histacin-4mg"
                        },

                        new Medicine
                        {
                            Name = "Cosec 20mg",
                            Description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
                            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an " +
                            "unknown printer took a galley of type and scrambled it to make a type specimen book",
                            MedicineLink = @"https://medex.com.bd/brands/1807/cosec-20mg"
                        },

                        new Medicine
                        {
                            Name = "Zimax 250mg",
                            Description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
                            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an " +
                            "unknown printer took a galley of type and scrambled it to make a type specimen book",
                            MedicineLink = @"https://medex.com.bd/brands/8721/zimax-250mg"
                        },

                        new Medicine
                        {
                            Name = "Seasonix 5mg",
                            Description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. " +
                            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an " +
                            "unknown printer took a galley of type and scrambled it to make a type specimen book",
                            MedicineLink = @"https://medex.com.bd/brands/12179/seasonix-5mg"
                        }

                      
                    };
                    context.Medicines.AddRange(medicines);
                    context.SaveChanges();
                }
                

            }
        }
    }
}
