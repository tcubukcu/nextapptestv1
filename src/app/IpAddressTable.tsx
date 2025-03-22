import React from 'react';
import axios from 'axios';
import styles from './IpAddressTable.module.css';

interface IpifyResponse {
  ip: string
}

async function getVercelIp() {
  const res : any = await axios.get<IpifyResponse>('https://api.ipify.org?format=json');
  return res.data.ip;
}

async function getykXML() {
  const res = await axios.get<IpifyResponse>('http://testwebservices.yurticikargo.com:9090/KOPSWebServices/ShippingOrderDispatcherServices?wsdl');
  return res;
}
const cargoUrl =
  "http://webservices.yurticikargo.com:8080/KOPSWebServices/ShippingOrderDispatcherServices?wsdl";
const cargoHeaders = { "Content-Type": "text/xml;charset=UTF-8" };
const queryShipmentDetailBody = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ship="http://yurticikargo.com.tr/ShippingOrderDispatcherServices">
   <soapenv:Header/>
   <soapenv:Body>
      <ship:queryShipmentDetail>
         <!--Optional:-->
         <wsUserName>1075G1048073138</wsUserName>
         <!--Optional:-->
         <wsPassword>i8u6G15e5c618s5x</wsPassword>
         <!--Optional:-->
         <wsLanguage>?</wsLanguage>
         <!--Zero or more repetitions:-->
         <keys>LT6136424431849</keys>
         <keyType>?</keyType>
         <addHistoricalData>?</addHistoricalData>
         <onlyTracking>?</onlyTracking>
         <jsonData>?</jsonData>
      </ship:queryShipmentDetail>
   </soapenv:Body>
</soapenv:Envelope>
  `;

async function queryShipmentDetail() {
  const response : any = await fetch(cargoUrl, {
    method: "POST", 
    headers: {
      ...cargoHeaders,
    },
    body: queryShipmentDetailBody,
    // body: createShipmentBody,
  });
  return (await response.text());
}

async function queryShipmentDetailwithproxy(fixieUrl: URL) {
  try {
    const response : any = await axios.post(cargoUrl, queryShipmentDetailBody, {
    headers: {
      ...cargoHeaders,
    },
    proxy: {
      protocol: 'http',
      host: fixieUrl.hostname,
      port: parseInt(fixieUrl.port, 10),
      auth: { username: fixieUrl.username, password: fixieUrl.password }
    }
  });
  return response.status;
}
catch (error) {
  console.error("Error creating shipment:", error);
  throw error; // Rethrow the error if needed  
}}

async function getFixieIp(fixieUrl: URL) {
  const res = await axios.get<IpifyResponse>('https://api.ipify.org?format=json', {
    proxy: {
      protocol: 'http',
      host: fixieUrl.hostname,
      port: parseInt(fixieUrl.port, 10),
      auth: { username: fixieUrl.username, password: fixieUrl.password }
    }
  });
  return res.data.ip;
}

const MissingEnvironmentVariableWarning = () => (
  <div className={styles.warning}>
    <p><strong>To use Fixie, you must set the FIXIE_URL environment variable.</strong></p>
    <p>
      If you host this project on Vercel and enable the Fixie integration, FIXIE_URL will be set automatically.
      Otherwise, you can set it manually, e.g.: <code>FIXIE_URL=https://fixie:password@... npm run dev</code>.
    </p>
  </div>
);

export default async function IpAddressTable() {
  if (!process.env.FIXIE_URL) {
    return (<MissingEnvironmentVariableWarning />);
  }
  const fixieUrl = new URL(process.env.FIXIE_URL);
  const vercelIp = await getVercelIp();
  const fixieIp = await getFixieIp(fixieUrl);
  // const ykXML = await getykXML();
  // console.log(JSON.stringify(ykXML.data));
  const shipment = await queryShipmentDetail();
  const shipmentwithproxy = await queryShipmentDetailwithproxy(fixieUrl);
  console.log("Fixie Giden Sorgu : ",shipmentwithproxy); 
  console.log("Vercel Giden Sorgu : ",JSON.stringify(shipment));
  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <th>Outbound IP Address Without Fixie</th>
          <td>{vercelIp}</td>
        </tr>
        <tr>
          <th>Outbound IP Address With Fixie</th>
          <td>{fixieIp}</td>
        </tr>
        <tr>
          <th>YK XML Response - Vercel IP'si ile gönderilen POST</th>
          <td>{JSON.stringify(shipment)}</td>
        </tr>
        <tr>
          <th>YK XML Response - Fixie IP'si ile gönderilen POST</th>
          <td>{shipmentwithproxy}</td>
        </tr>
      </tbody>
    </table>
  )
}