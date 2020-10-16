using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalManagement.Interfaces
{
    public interface IErrorrResult<T> where T:class
    {
        public bool error { get; set; }

        public string error_msg { get; set; }

        public T error_type { get; set; }
    }
}
