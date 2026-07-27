import { assets } from "../assets/assets"

const Contact = () => {

  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>CONTACT <span className="text-gray-700 font-semibold">US</span></p>
      </div>
      

      <div className="my-10 flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm">
        <img className="w-full md:max-w-[360px]" src={assets.contact_image} alt="" />

        <div className="flex flex-col justify-center gap-6 items-start">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-500">00000 Willms Station <br /> Suite 000, Washington, USA</p>
          <p className="text-gray-500">Tel: (000) 000-0000 <br /> Email: kyashaswini@gmail.com</p>
          <p className="font-semibold text-lg text-gray-600">CAREERS AT MEDIBRIDGE</p>
          <p className="text-gray-500">Learn more about our teams and job openings.</p>
          <button className="border border-black py-4 px-6 text-sm hover:bg-black hover:text-white transition-all duration-500">Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact