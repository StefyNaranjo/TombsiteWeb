import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaEdit, FaEraser } from "react-icons/fa";
import { Pagination } from 'react-bootstrap';

const MySwal = withReactContent(Swal);

const Show = () => {
  const [familiares, setFamiliares] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const familiaresCollection = collection(db, "familiares");

  const getFamiliares = async () => {
    try {
      const data = await getDocs(familiaresCollection);
      setFamiliares(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const deleteFamiliar = async (id) => {
    const familiarDoc = doc(db, "familiares", id);
    await deleteDoc(familiarDoc);
    getFamiliares();
  };

  const confirDelete = (id) => {
    MySwal.fire({
      title: "Eliminar registro",
      text: "¿Esta usted seguro que desea eliminar el registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar registro"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFamiliar(id);
        Swal.fire({
          title: "Eliminado",
          text: "El registro a sido eliminado",
          icon: "success"
        });
      }
    });
  }

  useEffect(() => {
    getFamiliares();
  }) ;

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredFamiliares = familiares.filter((familiares) => {
    return (
      (familiares.nombre && familiares.nombre.toLowerCase().includes(search.toLowerCase())) ||
      (familiares.fecha_nacimiento && familiares.fecha_nacimiento.toString().includes(search)) ||
      (familiares.fecha_fallecimiento && familiares.fecha_fallecimiento.toString().includes(search)) ||
      (familiares.coordenadas && familiares.coordenadas._lat.toString().includes(search) || familiares.coordenadas._long.toString().includes(search))
    );
  }).sort((a, b) => a.nombre.localeCompare(b.nombre));

  const formatCoordinates = (coordinates) => {
    if (!coordinates) return '';
    return `${coordinates._lat}, ${coordinates._long}`;
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedFamiliares = filteredFamiliares.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
    <header>
      <h1 className='titulo'>LISTADO DE REGISTROS</h1>
    </header>
      <div className="container.lis">
        <div className="row">
          <div className="col">
            <div className="d-grid gap-4">
            INGRESE EL NOMBRE DEL REGISTRO:
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Buscar..."
                style={{ margin: '10px', fontSize: '18px', width: '45%'}}
              />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha nacimiento</th>
                  <th>Fecha fallecimiento</th>
                  <th>Coordenadas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                
                {paginatedFamiliares.map((familiares) => {
                  const fechaNacimiento = familiares.fecha_nacimiento ? new Date(familiares.fecha_nacimiento * 1000) : null;
                  const fechaFallecimiento = familiares.fecha_fallecimiento ? new Date(familiares.fecha_fallecimiento * 1000) : null;

                  const yearNacimiento = fechaNacimiento ? Math.max(fechaNacimiento.getFullYear() - 1969, 1) : null;
                  const yearFallecimiento = fechaFallecimiento ? Math.max(fechaFallecimiento.getFullYear() - 1969, 1) : null;

                  const nuevaFechaNacimiento = fechaNacimiento ? new Date(fechaNacimiento) : null;
                  nuevaFechaNacimiento && nuevaFechaNacimiento.setFullYear(yearNacimiento);

                  const nuevaFechaFallecimiento = fechaFallecimiento ? new Date(fechaFallecimiento) : null;
                  nuevaFechaFallecimiento && nuevaFechaFallecimiento.setFullYear(yearFallecimiento);

                  return (
                    <tr key={familiares.id}>
                      <td>{familiares.nombre}</td>
                      <td>
                        {nuevaFechaNacimiento ? nuevaFechaNacimiento.toLocaleString('es-EC', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }) : ''}
                      </td>
                      <td>
                        {nuevaFechaFallecimiento ? nuevaFechaFallecimiento.toLocaleString('es-EC', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }) : ''}
                      </td>
                      <td>
                        {formatCoordinates(familiares.coordenadas)}
                      </td>
                      <td>
                      <Link to={`/edit/${familiares.id}`} href={`/edit/${familiares.id}`} className="icoshow">
                      <FaEdit /></Link>
                        <button className="icoshow" onClick={() => confirDelete(familiares.id)}>
                        <FaEraser />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination>
  {[...Array(Math.ceil(filteredFamiliares.length / rowsPerPage)).keys()].map((page) => (
    <Pagination.Item key={page} className="pagination-item" onClick={() => handlePageChange(page + 1)}>
      {page + 1}
    </Pagination.Item>
  ))}
</Pagination>
          </div>
        </div>
      </div>
    </>
  );
};

export default Show;