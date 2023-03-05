import Image from "next/image";
import styles from "../styles/landing.module.css";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { saveAs } from "file-saver";

const columns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
  },
  {
    name: "Title",
    selector: "title",
    sortable: true,
  },
  {
    name: "Status",
    selector: "completed",
    sortable: true,
    cell: (row) =>
      row.completed ? (
        <button className="btn btn-success"> Completed</button>
      ) : (
        <button className="btn btn-danger">Not Completed</button>
      ),
  },
];

const Landing = ({ todos }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({
        title: formData.title,
        completed: formData.completed,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Todo berhasil ditambahkan");
        handleCloseModal();
        setFormData({
          title: "",
          completed: false,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menambahkan todo");
      });
  };

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleExportToExcel = () => {
    const filename = "todos.csv";
    const fileType = "text/csv;charset=utf-8;";
    const data = todos.map(({ id, title, completed }) => ({
      id,
      title,
      completed,
    }));
    const csvData = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csvData], { type: fileType });
    saveAs(blob, filename);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePerPageChange = (perPage, page) => {
    setTodosPerPage(perPage);
    setCurrentPage(page);
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalTodos = filteredTodos.length;
  return (
    <>
      <main className={styles.main}>
        <section
          className={`col-12 d-flex ${styles["banner-mid"]} ${styles.infograph}`}
        >
          <div className="col-6">
            <Image
              src={"/assets/benner1.svg"}
              alt="banner top"
              width={500}
              height={500}
              className={styles.banner}
            />
          </div>
          <div className="col-12 col-md-6 m-0 ml-md-5">
            <h2>Apa Saja Fitur Yang Ada di Aplikasi ToDoList?</h2>
            <div className="d-flex flex-row">
              <Image
                src={"/assets/check.svg"}
                alt="check icon"
                width={20}
                height={20}
                className={styles["check-purple"]}
              />
              <p>Aplikasi Kekinian 2023</p>
            </div>
            <div className="d-flex flex-row">
              <Image
                src={"/assets/check.svg"}
                alt="check icon"
                width={20}
                height={20}
                className={styles["check-purple"]}
              />
              <p>Memiliki Fitur Canggih</p>
            </div>
            <div className="d-flex flex-row">
              <Image
                src={"/assets/check.svg"}
                alt="check icon"
                width={20}
                height={20}
                className={styles["check-purple"]}
              />
              <p>Data Sangat Lengkap</p>
            </div>
            <div className="d-flex flex-row">
              <Image
                src={"/assets/check.svg"}
                alt="check icon"
                width={20}
                height={20}
                className={styles["check-purple"]}
              />
              <p>Pandai Mencari Kebutuhan User</p>
            </div>
          </div>
        </section>

        <section
          id="list"
          className={`col-12 container mb-5 mt-5 ${styles.infograph}`}
        >
          <div className="container">
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-success me-3"
                  onClick={handleExportToExcel}
                >
                  Export to Excel
                </button>

                <Button variant="primary" onClick={handleShowModal}>
                  Tambah Todo
                </Button>

                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Tambah Todo</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleSubmitForm}>
                      <Form.Group controlId="title">
                        <Form.Label>Judul:</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group controlId="completed">
                        <Form.Check
                          type="checkbox"
                          label="Selesai"
                          name="completed"
                          checked={formData.completed}
                          onChange={handleFormChange}
                        />
                      </Form.Group>
                      <Button
                        className="me-3 mt-3"
                        variant="secondary"
                        onClick={handleCloseModal}
                      >
                        Batal
                      </Button>
                      <Button
                        className="me-3 mt-3"
                        variant="primary"
                        type="submit"
                      >
                        Simpan
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
            <DataTable
              columns={columns}
              data={currentTodos}
              pagination
              paginationServer
              paginationTotalRows={totalTodos}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerPageChange}
              paginationRowsPerPageOptions={[3, 5, 10, 25, 50, 100]}
              progressPending={loading}
              className={styles.tables}
            />
          </div>
        </section>
      </main>
    </>
  );
};

// SSR
export async function getServerSideProps(context) {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );
  const todos = response.data;
  return {
    props: { todos },
  };
}
export default Landing;
