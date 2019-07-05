using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AscendPortal
{
    public class AppSettings
    {
        [JsonProperty("orderManagementCommandAPI")]
        public string OrderManagementCommandAPI { get; set; }
        [JsonProperty("orderManagementQueryAPI")]
        public string OrderManagementQueryAPI { get; set; }
        [JsonProperty("orderFulfillmentCommandAPI")]
        public string OrderFulfillmentCommandAPI { get; set; }
        [JsonProperty("orderFulfillmentQueryAPI")]
        public string OrderFulfillmentQueryAPI { get; set; }
        [JsonProperty("vendorProfileQueryAPI")]
        public string VendorProfileQueryAPI { get; set; }  
        [JsonProperty("vendorProfileCommandAPI")]
        public string VendorProfileCommandAPI { get; set; }
        [JsonProperty("vendorHistoryQueryAPI")]
        public string VendorHistoryQueryAPI { get; set; }
        [JsonProperty("vendorACHInformationCommandAPI")]
        public string vendorACHInformationCommandAPI { get; set; }

        [JsonProperty("vendorACHInformationQueryAPI")]
        public string vendorACHInformationQueryAPI { get; set; }

        [JsonProperty("vendorCoverageAreaCommandAPI")]
        public string vendorCoverageAreaCommandAPI { get; set; }

        [JsonProperty("vendorCoverageAreaQueryAPI")]
        public string vendorCoverageAreaQueryAPI { get; set; }
      

        [JsonProperty("vendorSearchqueryAPI")]
        public string vendorSearchqueryAPI { get; set; }
       
        [JsonProperty("azureSearchKey")]
        public string azureSearchKey { get; set; }

        [JsonProperty("vendorDocumentCommandAPI")]
        public string vendorDocumentCommandAPI { get; set; }

        [JsonProperty("vendorDocumentQueryAPI")]
        public string vendorDocumentQueryAPI { get; set; }

        [JsonProperty("vendorDocumentCommandAPIAsPDF")]
        public string vendorDocumentCommandAPIAsPDF { get; set; }


        [JsonProperty("commentsManagementCommandAPI")]
        public string CommentsManagementCommandAPI { get; set; }
    }
}
