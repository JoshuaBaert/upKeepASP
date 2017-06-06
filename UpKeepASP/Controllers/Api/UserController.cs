using Microsoft.AspNetCore.Routing;

namespace UpKeepASP.Controllers.Api
{
    [Route("api/user")]
    public class UserController : Controller
    {
        
        [HttpGet("")]
        public IActionResult Get ()
        {
            
        }
        
        [HttpPut("")]
        public IActionResult Put ()
        {
            
        }
    }
}