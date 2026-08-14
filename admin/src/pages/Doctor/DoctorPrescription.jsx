import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'

export const DoctorPrescription = () => {

    const { appointmentId } = useParams()
    const {createPrescription, getPrescriptions} = useContext(DoctorContext)

    const [diagnosis, setDiagnosis] = useState('')
    const [additionalNotes, setAdditionalNotes] = useState('')

    const [existingPrescription, setExistingPrescription] = useState(null)
    const [loading,setLoading] = useState(true)

    const [medicines, setMedicines] = useState([
        {
            medicineName: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        }
    ])

    const submitHandler = async() => {
        const prescriptionData = {
            appointmentId,
            diagnosis,
            medicines,
            additionalNotes
        }
        const success = await createPrescription(prescriptionData)
        if(success) {
            const prescription = await getPrescriptions(appointmentId)
            setExistingPrescription(prescription)
        }
    }

    useEffect(()=> {
        const fetchPrescription = async() => {
            const prescription = await getPrescriptions(appointmentId)
            setExistingPrescription(prescription)
            setLoading(false)
        }
        fetchPrescription()
    }, [appointmentId])

    if (loading) {
        return <div className='m-5'>Loading....</div>
    }
    if(existingPrescription) {
        return (
            <div className='w-full max-w-5xl m-5'>

                <p className='mb-5 text-lg font-medium'>
                    Prescription
                </p>

                <div className='bg-white border rounded p-5'>

                    <p className='font-medium mb-2'>
                        Diagnosis
                    </p>

                    <p className='mb-5'>
                        {existingPrescription.diagnosis}
                    </p>


                    <p className='font-medium mb-3'>
                        Medicines
                    </p>

                    {existingPrescription.medicines.map((medicine, index) => (

                        <div
                            key={index}
                            className='border rounded p-4 mb-3'
                        >

                            <p>
                                <strong>Medicine:</strong>{' '}
                                {medicine.medicineName}
                            </p>

                            <p>
                                <strong>Dosage:</strong>{' '}
                                {medicine.dosage}
                            </p>

                            <p>
                                <strong>Frequency:</strong>{' '}
                                {medicine.frequency}
                            </p>

                            <p>
                                <strong>Duration:</strong>{' '}
                                {medicine.duration}
                            </p>

                            {medicine.instructions && (
                                <p>
                                    <strong>Instructions:</strong>{' '}
                                    {medicine.instructions}
                                </p>
                            )}

                        </div>

                    ))}


                    {existingPrescription.additionalNotes && (

                        <div className='mt-5'>

                            <p className='font-medium'>
                                Additional Notes
                            </p>

                            <p>
                                {existingPrescription.additionalNotes}
                            </p>

                        </div>

                    )}

                </div>

            </div>
        )
    }
    return (
        <div className='w-full max-w-5xl m-5'>

            <p className='mb-5 text-lg font-medium'>
                Create Prescription
            </p>

            {/* Diagnosis */}
            <div className='bg-white border rounded p-5 mb-5'>

                <p className='mb-2 font-medium'>
                    Diagnosis
                </p>

                <textarea
                    className='w-full border rounded p-2'
                    rows='3'
                    placeholder='Enter diagnosis'
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                />

            </div>


            {/* Medicines */}
            <div className='bg-white border rounded p-5 mb-5'>

                <div className='flex justify-between items-center mb-4'>

                    <p className='font-medium'>
                        Medicines
                    </p>

                    <button
                        type='button'
                        className='bg-primary text-white px-4 py-2 rounded'
                        onClick={() =>
                            setMedicines([
                                ...medicines,
                                {
                                    medicineName: '',
                                    dosage: '',
                                    frequency: '',
                                    duration: '',
                                    instructions: ''
                                }
                            ])
                        }
                    >
                        + Add Medicine
                    </button>

                </div>


                {medicines.map((medicine, index) => (

                    <div
                        key={index}
                        className='border rounded p-4 mb-4'
                    >

                        <p className='font-medium mb-3'>
                            Medicine {index + 1}
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>

                            <input
                                className='border rounded p-2'
                                placeholder='Medicine name'
                                value={medicine.medicineName}
                                onChange={(e) => {

                                    const updatedMedicines = [...medicines]

                                    updatedMedicines[index].medicineName =
                                        e.target.value

                                    setMedicines(updatedMedicines)
                                }}
                            />

                            <input
                                className='border rounded p-2'
                                placeholder='Dosage (e.g. 500mg)'
                                value={medicine.dosage}
                                onChange={(e) => {

                                    const updatedMedicines = [...medicines]

                                    updatedMedicines[index].dosage =
                                        e.target.value

                                    setMedicines(updatedMedicines)
                                }}
                            />

                            <input
                                className='border rounded p-2'
                                placeholder='Frequency (e.g. Twice a day)'
                                value={medicine.frequency}
                                onChange={(e) => {

                                    const updatedMedicines = [...medicines]

                                    updatedMedicines[index].frequency =
                                        e.target.value

                                    setMedicines(updatedMedicines)
                                }}
                            />

                            <input
                                className='border rounded p-2'
                                placeholder='Duration (e.g. 5 days)'
                                value={medicine.duration}
                                onChange={(e) => {

                                    const updatedMedicines = [...medicines]

                                    updatedMedicines[index].duration =
                                        e.target.value

                                    setMedicines(updatedMedicines)
                                }}
                            />

                        </div>


                        <textarea
                            className='w-full border rounded p-2 mt-3'
                            rows='2'
                            placeholder='Instructions'
                            value={medicine.instructions}
                            onChange={(e) => {

                                const updatedMedicines = [...medicines]

                                updatedMedicines[index].instructions =
                                    e.target.value

                                setMedicines(updatedMedicines)
                            }}
                        />

                    </div>

                ))}

            </div>


            {/* Additional notes */}
            <div className='bg-white border rounded p-5 mb-5'>

                <p className='mb-2 font-medium'>
                    Additional Notes
                </p>

                <textarea
                    className='w-full border rounded p-2'
                    rows='3'
                    placeholder='Additional instructions for the patient'
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                />

            </div>


            <button onClick={submitHandler}
                className='bg-primary text-white px-6 py-3 rounded'
            >
                Create Prescription
            </button>

        </div>
    )
}
