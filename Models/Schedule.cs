using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Models
{
    public class Schedule
    {
        public long Id { get; set; }
        public DayOfWeek DayName { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }
    }



    public class ScheduleModel
    {
        public long id { get; set; }
        public DayOfWeek day_name { get; set; }

        public DateTime start_time { get; set; }

        public DateTime end_time { get; set; }
    }
}
