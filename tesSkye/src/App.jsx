import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import { FaPlus, FaEdit, FaTrash, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaTransgender, FaWhatsapp, FaChalkboardTeacher, FaIdCard, FaRunning } from 'react-icons/fa'; //import { createContext } from 'react';
import Tema from './Tema';
import { createContext } from 'react';

export const TemaContext = createContext({
  tema: null,
  setTema: () => {},
})

const App = () => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Perempuan');
  const [noWhatsapp, setNoWhatsapp] = useState('');
  const [kelas, setKelas] = useState('');
  const [nomorIndukSiswa, setNomorIndukSiswa] = useState('');
  const [hobi, setHobi] = useState('');
  const [siswa, setSiswa] = useState([]);
  const [editId, setEditId] = useState(null); 
  const [tema, setTema] = useState("dark");

  const siswaCollectionRef = collection(db, "siswa");

  const fetchSiswa = async () => {
    const data = await getDocs(siswaCollectionRef);
    setSiswa(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const isValidNoWhatsapp = (noWhatsapp) => {
    return /^08\d{10,}$/.test(noWhatsapp);
  };

  const isValidNomorIndukSiswa = (nomorIndukSiswa) => {
    return /^\d{10,}$/.test(nomorIndukSiswa);
  };

  const createOrUpdateSiswa = async () => {
    if (!isValidNoWhatsapp(noWhatsapp)) {
      alert('No Whatsapp harus dimulai dengan 08 dan memiliki minimal 10 angka.');
      return;
    }

    if (!isValidNomorIndukSiswa(nomorIndukSiswa)) {
      alert('Nomor Induk Siswa harus berupa angka dan memiliki minimal 10 angka.');
      return;
    }

    if (editId) {
      if (!window.confirm('Apakah Anda yakin ingin mengupdate data siswa ini?')) {
        return; 
      }
      const siswaDoc = doc(db, "siswa", editId);
      await updateDoc(siswaDoc, {
        namaLengkap,
        tanggalLahir: new Date(tanggalLahir),
        tempatLahir,
        jenisKelamin,
        noWhatsapp,
        kelas: Number(kelas),
        nomorIndukSiswa: String(nomorIndukSiswa),
        hobi: hobi.split(','),
      });
    } else {
      await addDoc(siswaCollectionRef, {
        namaLengkap,
        tanggalLahir: new Date(tanggalLahir),
        tempatLahir,
        jenisKelamin,
        noWhatsapp,
        kelas: Number(kelas),
        nomorIndukSiswa: String(nomorIndukSiswa),
        hobi: hobi.split(','),
      });
    }
    resetForm();
    fetchSiswa();
  };
  
  const deleteSiswa = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data siswa ini?')) {
      return; 
    }
    const siswaDoc = doc(db, "siswa", id);
    await deleteDoc(siswaDoc);
    fetchSiswa();
  };
  

  const editSiswa = (siswaItem) => {
    setEditId(siswaItem.id);
    setNamaLengkap(siswaItem.namaLengkap);
    setTanggalLahir(siswaItem.tanggalLahir.toDate().toISOString().split('T')[0]);
    setTempatLahir(siswaItem.tempatLahir);
    setJenisKelamin(siswaItem.jenisKelamin);
    setNoWhatsapp(siswaItem.noWhatsapp);
    setKelas(siswaItem.kelas);
    setNomorIndukSiswa(siswaItem.nomorIndukSiswa);
    setHobi(siswaItem.hobi.join(','));
  };

  const resetForm = () => {
    setEditId(null);
    setNamaLengkap('');
    setTanggalLahir('');
    setTempatLahir('');
    setJenisKelamin('Perempuan');
    setNoWhatsapp('');
    setKelas('');
    setNomorIndukSiswa('');
    setHobi('');
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  useEffect(() => {
    console.log(
      `Tema berhasil Diubah keMode ${tema}`
    )
  }, [tema]);

  return (
    <TemaContext.Provider value={{ tema, setTema }}>
      <div className={`flex items-center justify-center min-h-screen ${tema === "light" ? "bg-gray-300" : "bg-gradient-to-b from-gray-800 to-black"} p-4`}>
        <div className={`w-full max-w-3xl shadow-lg rounded-lg p-6 ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"} p-4`}>
          <Tema />
          <h1 className="text-2xl font-bold mb-8 text-center">Biodata Siswa</h1>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 lg:pr-4 mb-6 lg:mb-0">
              <div className="mb-4">
              <div className="flex items-center border p-2 rounded mb-2">
                  <FaUser className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className={`border-none w-full outline-none ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}
                  />
                </div>
                <div className="flex items-center border p-2 rounded mb-2">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <input
                    type="date"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className={`border-none w-full outline-none ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}
                  />
                </div>
                <div className="flex items-center border p-2 rounded mb-2">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Tempat Lahir"
                    value={tempatLahir}
                    onChange={(e) => setTempatLahir(e.target.value)}
                    className={`border-none w-full outline-none ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}
                  />
                </div>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value)}
                  className={`flex items-center border p-2 rounded mb-2 w-full ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}

                >
                  <option value="Perempuan">1. Perempuan</option>
                  <option value="Laki-laki">2. Laki-laki</option>
                </select>
                <div className="flex items-center border p-2 rounded mb-2">
                  <FaWhatsapp className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="No Whatsapp"
                    value={noWhatsapp}
                    onChange={(e) => setNoWhatsapp(e.target.value)}
                    className={`border-none w-full outline-none ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}
                  />
                </div>
                <div className="flex items-center border p-2 rounded mb-2">
                  <FaChalkboardTeacher className="mr-2 text-gray-500" />
                  <input
                    type="number"
                    placeholder="Kelas"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className={`border-none w-full outline-none ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}
                  />
                </div>
                <div className="flex items-center border p-2 rounded mb-2">
                  <FaIdCard className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Nomor Induk Siswa"
                    value={nomorIndukSiswa}
                    onChange={(e) => setNomorIndukSiswa(e.target.value)}
                    className={`border-none w-full outline-none ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}
                  />
                </div>
                <div className="flex items-center border p-2 rounded mb-2">
                  <FaRunning className="mr-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Hobi (pisahkan dengan koma)"
                    value={hobi}
                    onChange={(e) => setHobi(e.target.value)}
                    className={`border-none w-full outline-none ${tema === "light" ? "bg-gray-300 text-blue-800" : "bg-gradient-to-b from-gray-600 to-gray-700 text-gray-300"}`}
                  />
                </div>                
                <div className="flex justify-center pt-6">
                  <button
                    onClick={createOrUpdateSiswa}
                    className={`bg-gradient-to-b p-2 rounded flex items-center ${tema === "light" ? "bg-gradient-to-b from-blue-600 to-blue-800 text-gray-" : "bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100"}`}
                  >
                    <FaPlus className="mr-2" />
                    {editId ? 'Update Siswa' : 'Tambah Siswa'}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 lg:pl-4">
              <h2 className="text-xl font-bold mb-4">Daftar Siswa</h2>
              <h2 className="text-xl font-bold mb-4">Total Siswa ({siswa.length} siswa)</h2>
              {siswa.map((siswaItem) => (
                <div key={siswaItem.id} className="border p-4 mb-4">
                  <p className="flex items-center"><FaUser className="mr-2" />Nama Lengkap: {siswaItem.namaLengkap}</p>
                  <p className="flex items-center"><FaCalendarAlt className="mr-2" />Tanggal Lahir: {new Date(siswaItem.tanggalLahir.seconds * 1000).toLocaleDateString()}</p>
                  <p className="flex items-center"><FaMapMarkerAlt className="mr-2" />Tempat Lahir: {siswaItem.tempatLahir}</p>
                  <p className="flex items-center"><FaTransgender className="mr-2" />Jenis Kelamin: {siswaItem.jenisKelamin}</p>
                  <p className="flex items-center"><FaWhatsapp className="mr-2" />No Whatsapp: {siswaItem.noWhatsapp}</p>
                  <p className="flex items-center"><FaChalkboardTeacher className="mr-2" />Kelas: {siswaItem.kelas}</p>
                  <p className="flex items-center"><FaIdCard className="mr-2" />Nomor Induk Siswa: {siswaItem.nomorIndukSiswa}</p>
                  <p className="flex items-center"><FaRunning className="mr-2" />Hobi: {siswaItem.hobi.join(', ')}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => editSiswa(siswaItem)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteSiswa(siswaItem.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TemaContext.Provider>
  );
};

export default App;
