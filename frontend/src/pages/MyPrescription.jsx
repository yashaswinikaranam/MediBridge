import { useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { AppContext } from "../context/AppContext"
import { useContext, useEffect, useState } from "react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const MyPrescription = () => {

    const {appointmentId} = useParams() 
    const {backendUrl, token} = useContext(AppContext)
    const [prescription,setPrescription] = useState(null)
    const [appointment,setAppointment] = useState(null)
    const [loading,setLoading] = useState(true)

    const downloadPDF = () => {

    const doc = new jsPDF()

    // HEADER

    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("MediBridge", 105, 20, {
        align: "center"
    })

    doc.setFontSize(15)
    doc.setFont("helvetica", "normal")
    doc.text("Medical Prescription", 105, 29, {
        align: "center"
    })

    doc.line(15, 35, 195, 35)


    // DOCTOR

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Doctor", 15, 48)

    doc.setFont("helvetica", "normal")
    doc.text(
        appointment?.docData?.name || "N/A",
        15,
        56
    )

    doc.text(
        appointment?.docData?.speciality || "N/A",
        15,
        63
    )


    // PATIENT

    doc.setFont("helvetica", "bold")
    doc.text("Patient", 110, 48)

    doc.setFont("helvetica", "normal")
    doc.text(
        appointment?.userData?.name || "N/A",
        110,
        56
    )


    // DATE & TIME

    doc.setFont("helvetica", "bold")
    doc.text("Appointment", 15, 77)

    doc.setFont("helvetica", "normal")
    doc.text(
        `${appointment?.slotDate || ""} | ${appointment?.slotTime || ""}`,
        15,
        85
    )


    // DIAGNOSIS

    doc.setFont("helvetica", "bold")
    doc.text("Diagnosis", 15, 100)

    doc.setFont("helvetica", "normal")

    const diagnosis = doc.splitTextToSize(
        prescription.diagnosis || "N/A",
        175
    )

    doc.text(diagnosis, 15, 108)


    // MEDICINES

    const diagnosisHeight = diagnosis.length * 5

    doc.setFont("helvetica", "bold")

    doc.text(
        "Medicines",
        15,
        120 + diagnosisHeight
    )


    autoTable(doc, {

        startY: 126 + diagnosisHeight,

        head: [[
            "Medicine",
            "Dosage",
            "Frequency",
            "Duration",
            "Instructions"
        ]],

        body: prescription.medicines.map(medicine => [
            medicine.medicineName || "",
            medicine.dosage || "",
            medicine.frequency || "",
            medicine.duration || "",
            medicine.instructions || ""
        ]),

        theme: "grid",

        styles: {
            fontSize: 8,
            cellPadding: 3
        },

        headStyles: {
            fontStyle: "bold"
        }

    })


    // NOTES

    if (prescription.additionalNotes) {

        const finalY = doc.lastAutoTable.finalY + 15

        doc.setFont("helvetica", "bold")
        doc.text("Additional Notes", 15, finalY)

        doc.setFont("helvetica", "normal")

        const notes = doc.splitTextToSize(
            prescription.additionalNotes,
            175
        )

        doc.text(notes, 15, finalY + 8)
    }


    // FOOTER

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")

    doc.text(
        "This prescription was generated through MediBridge.",
        105,
        285,
        { align: "center" }
    )


    doc.save(
        `MediBridge_Prescription_${appointmentId}.pdf`
    )
}

    const viewPrescriptions = async() => {
    try {
      const {data} = await axios.get(backendUrl+`/api/user/prescription/${appointmentId}`,{headers:{token}})
      if(data.success) {
        setPrescription(data.prescription)
        setAppointment(data.appointment)
      } else {
        toast.error(data.message)
      }
    } catch(error) {
      toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  useEffect(()=> {
    if(token && appointmentId) {
        viewPrescriptions()
    }
  },[token,appointmentId])

  if(loading) {
     return (
            <div className="flex justify-center mt-20">
                <p>Loading prescription...</p>
            </div>
        ) 
  }


  return (
        <div className="max-w-3xl mx-auto mt-10 mb-10">

            <div className="bg-white border rounded-lg p-6">

                <div className="flex justify-between items-center border-b pb-4 mb-6">

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Prescription
                        </h1>

                        <div className="grid sm:grid-cols-2 gap-6 border-b pb-5 mb-6">

    <div>
        <p className="text-sm text-gray-500">
            Doctor
        </p>

        <p className="font-semibold text-gray-800">
            {appointment?.docData?.name}
        </p>

        <p className="text-sm text-gray-600">
            {appointment?.docData?.speciality}
        </p>
    </div>


    <div>
        <p className="text-sm text-gray-500">
            Patient
        </p>

        <p className="font-semibold text-gray-800">
            {appointment?.userData?.name}
        </p>
    </div>


    <div>
        <p className="text-sm text-gray-500">
            Appointment Date
        </p>

        <p className="font-medium">
            {appointment?.slotDate}
        </p>
    </div>


    <div>
        <p className="text-sm text-gray-500">
            Appointment Time
        </p>

        <p className="font-medium">
            {appointment?.slotTime}
        </p>
    </div>

</div>

                        <p className="text-sm text-gray-500 mt-1">
                            MediBridge
                        </p>
                    </div>

                    <button
                        onClick={downloadPDF}
                        className="border px-4 py-2 rounded text-primary hover:bg-primary hover:text-white"
                    >
                        Download PDF
                    </button>

                </div>


                {/* Diagnosis */}

                <div className="mb-6">

                    <p className="font-semibold text-gray-800">
                        Diagnosis
                    </p>

                    <p className="text-gray-600 mt-1">
                        {prescription.diagnosis}
                    </p>

                </div>


                {/* Medicines */}

                <div>

                    <p className="font-semibold text-gray-800 mb-3">
                        Medicines
                    </p>

                    {prescription.medicines.map((medicine, index) => (

                        <div
                            key={index}
                            className="border rounded-lg p-4 mb-3"
                        >

                            <p>
                                <span className="font-medium">
                                    Medicine:
                                </span>{" "}
                                {medicine.medicineName}
                            </p>

                            <p>
                                <span className="font-medium">
                                    Dosage:
                                </span>{" "}
                                {medicine.dosage}
                            </p>

                            <p>
                                <span className="font-medium">
                                    Frequency:
                                </span>{" "}
                                {medicine.frequency}
                            </p>

                            <p>
                                <span className="font-medium">
                                    Duration:
                                </span>{" "}
                                {medicine.duration}
                            </p>

                            {medicine.instructions && (
                                <p>
                                    <span className="font-medium">
                                        Instructions:
                                    </span>{" "}
                                    {medicine.instructions}
                                </p>
                            )}

                        </div>

                    ))}

                </div>


                {/* Additional Notes */}

                {prescription.additionalNotes && (

                    <div className="mt-6 border-t pt-5">

                        <p className="font-semibold text-gray-800">
                            Additional Notes
                        </p>

                        <p className="text-gray-600 mt-1">
                            {prescription.additionalNotes}
                        </p>

                    </div>

                )}

            </div>

        </div>
    )
}

export default MyPrescription
