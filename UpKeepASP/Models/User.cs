using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;

namespace UpKeepASP.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string phone { get; set; }
        public bool AllowEmails { get; set; }
        public bool AllowTexts { get; set; }
        public string FacebookId { get; set; }
        public string GoogleId { get; set; }

        public IEnumerable<List> Lists { get; set; }
    }
}