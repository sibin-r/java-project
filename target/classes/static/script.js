window.onload = () => {
    function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  // Login redirection
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.onsubmit = async e => {
      e.preventDefault();
      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      console.log("Login status:", response.status);
      if (response.ok) {
        const user = await response.json();
         const selectedRole = document.getElementById("loginRole").value;

        if (user.role !== selectedRole) {
        alert("Invalid role selection. You are not authorized as " + selectedRole);
         return;
        }
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = user.role === "admin" ? "admin-dashboard.html" : "user-dashboard.html";
      } else {
        alert("Invalid login. Try again.");
      }
    };
  }

  // Signup form submission
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.onsubmit = async e => {
      e.preventDefault();

      const user = {
        username: document.getElementById("signupUsername").value,
        password: document.getElementById("signupPassword").value,
        email: document.getElementById("signupEmail").value,
        fullName: document.getElementById("signupFullName").value,
        address: document.getElementById("signupAddress").value,
        contactNumber: document.getElementById("signupPhone").value,
        role: document.getElementById("signupRole").value,
       // organizationName: document.getElementById("signupOrg").value || null
      };
      
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      console.log("Signup status:", response.status);
      if (response.ok) {
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert("Signup failed.");
      }
    };
  }

  // Admin: Create Event
  const createForm = document.getElementById("createEventForm");
  if (createForm) {
    createForm.onsubmit = async e => {
      e.preventDefault();
      const name = document.getElementById("eventName").value;
      const date = document.getElementById("eventDate").value;

      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date })
      });

      alert("Event created!");
      createForm.reset();
      loadAdminEvents();
    };
  }

  // Admin: Load Events
  async function loadAdminEvents() {
  const ul = document.getElementById("adminEventList");
  if (!ul) return;

  const res = await fetch("/api/events");
  const events = await res.json();

  ul.innerHTML = "";

  events.forEach(event => {
    const li = document.createElement("li");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("event-info");
    infoDiv.innerHTML = `
      <div class="event-name">${event.name}</div>
      <div class="event-date">${formatDate(event.date)} - Total: Rs:${event.totalAmount}</div>
    `;

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("event-actions");

    const editBtn = document.createElement("div");
    editBtn.classList.add("event-action");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      editEvent(event.id, event.name, event.date);
    });

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("event-action", "delete");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteEvent(event.id);
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(infoDiv);
    li.appendChild(actionsDiv);

    ul.appendChild(li);
  });
}


  // Admin: Edit Event
 /* window.editEvent = async (id, name, date) => {
    const newName = prompt("Enter new name:", name);
    const newDate = prompt("Enter new date:", date);
    if (newName && newDate) {
      await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, date: newDate })
      });
      loadAdminEvents();
    }
  };*/
 window.editEvent = async (id, name, date) => {
  const originalDate = new Date(date);
  const day = String(originalDate.getDate()).padStart(2, '0');
  const month = String(originalDate.getMonth() + 1).padStart(2, '0');
  const year = originalDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const newName = prompt("Enter new name:", name);
  if (!newName) return;

  let newDateInput;
  let valid = false;

  while (!valid) {
    newDateInput = prompt("Enter new date (dd-mm-yyyy):", formattedDate);
    if (!newDateInput) return;

    const dateParts = newDateInput.split("-");
    if (dateParts.length !== 3) {
      alert("Invalid format. Please use dd-mm-yyyy.");
      continue;
    }

    const [dd, mm, yyyy] = dateParts.map(str => parseInt(str));
    if (
      isNaN(dd) || isNaN(mm) || isNaN(yyyy) ||
      mm < 1 || mm > 12 || dd < 1 || dd > 31
    ) {
      alert("Invalid date. Please ensure day, month, and year are correct.");
      continue;
    }

    valid = true;
    const isoDate = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;

    await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, date: isoDate })
    });

    loadAdminEvents();
  }
};



  // Admin: Delete Event
  window.deleteEvent = async id => {
    if (confirm("Delete this event?")) {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      loadAdminEvents();
    }
  };

  // User: Load Events
  async function loadUserEvents() {
    const ul = document.getElementById("userEventList") || document.getElementById("events");
    if (!ul) return;

    const res = await fetch("/api/events");
    const events = await res.json();

    ul.innerHTML = "";
    events.forEach(event => {
      const li = document.createElement("li");
      li.innerHTML = `
  <div class="event-info">
    <div class="event-name">${event.name}</div>
    <div class="event-date">${formatDate(event.date)}</div>
  </div>

  <button class="event-action"
          data-id="${event.id}"
          data-name="${event.name}">
    Donate
  </button>
`;
      ul.appendChild(li);
    });
  }

  // User: Donate to Event
  window.donateToEvent = async (eventId, eventName) => {
   // const name = prompt("Your name:");
    const amount = prompt("Donation amount:");
    const user = JSON.parse(localStorage.getItem("user"));
    const name = user.fullName;
    if (name && amount && !isNaN(amount)) {
      await fetch(`/api/donations/donate/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName: name, amount: parseFloat(amount),userId: user.id })
      });

      alert(`Thank you, ${name}, for donating $${amount} to ${eventName}!`);
      loadDonationHistory();
    }
  };
  async function loadDonationHistory() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
  
    const res = await fetch(`/api/donations/user/${user.id}`);
    const donations = await res.json();
  
    const ul = document.getElementById("donationHistory");
    ul.innerHTML = "";
    donations.forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.donorName} donated Rs:${d.amount} to ${d.eventName}`;
      ul.appendChild(li);
    });
  }
  

  // User: Donation History
/*  async function loadDonationHistory() {
    const ul = document.getElementById("donationHistory");
    if (!ul) return;

    const res = await fetch("/api/donations");
    const donations = await res.json();

    ul.innerHTML = "";
    donations.forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.donorName} donated $${d.amount} to ${d.eventName}`;
      ul.appendChild(li);
    });
  }*/

  // Initialize pages
  loadAdminEvents?.();
  loadUserEvents?.();
  loadDonationHistory?.();
};
