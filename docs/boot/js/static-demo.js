// Static Demo Database and Authentication Controller using localStorage
document.addEventListener("DOMContentLoaded", function() {
  // Initialize default database if not exists
  if (!localStorage.getItem("gym_members")) {
    const defaultMembers = [
      { id: 1, username: "jack", email: "jack@gym.com", pect: 85, paid: true },
      { id: 2, username: "john", email: "john@gym.com", pect: 70, paid: false },
      { id: 3, username: "sarah", email: "sarah@gym.com", pect: 92, paid: true },
      { id: 4, username: "gajen", email: "gajen@gmail.com", pect: 64, paid: false }
    ];
    localStorage.setItem("gym_members", JSON.stringify(defaultMembers));
  }

  if (!localStorage.getItem("gym_workouts")) {
    const defaultWorkouts = {
      "jack": ["Monday: Chest & Triceps", "Wednesday: Back & Biceps", "Friday: Legs & Shoulders"],
      "admin": ["Tuesday: Cardio & Core", "Thursday: Full Body Strength"]
    };
    localStorage.setItem("gym_workouts", JSON.stringify(defaultWorkouts));
  }

  // Get auth state
  let username = localStorage.getItem("demo_username");
  let isAdmin = localStorage.getItem("demo_is_admin") === "true";

  // 1. Navbar setup
  setupNavbar();

  // 2. Handle specific page features
  const path = window.location.pathname;
  if (path.endsWith("register.html")) {
    handleRegisterPage();
  } else if (path.endsWith("profile.html")) {
    handleProfilePage();
  } else if (path.endsWith("workouts.html")) {
    handleWorkoutsPage();
  } else if (path.endsWith("attendance.html")) {
    handleAttendancePage();
  } else if (path.endsWith("admin.html")) {
    handleAdminPage();
  }

  // Navbar builder
  function setupNavbar() {
    const navbarNav = document.getElementById("nav-links");
    const navbarRight = document.getElementById("nav-auth");

    if (navbarNav) {
      let html = `
        <li class="${isActive('index.html')}"><a href="index.html">Home</a></li>
        <li class="${isActive('packages.html')}"><a href="packages.html">Package</a></li>
        <li class="${isActive('facilities.html')}"><a href="facilities.html">Facilities</a></li>
        <li class="${isActive('about.html')}"><a href="about.html">About</a></li>
        <li class="${isActive('contact.html')}"><a href="contact.html">Contact</a></li>
      `;
      if (username) {
        html += `
          <li class="${isActive('profile.html')}"><a href="profile.html">Profile</a></li>
          <li class="${isActive('workouts.html')}"><a href="workouts.html">Workouts</a></li>
          <li class="${isActive('attendance.html')}"><a href="attendance.html">Attendance</a></li>
        `;
        if (isAdmin) {
          html += `<li class="${isActive('admin.html')}"><a href="admin.html">Admin Panel</a></li>`;
        }
      }
      navbarNav.innerHTML = html;
    }

    if (navbarRight) {
      if (username) {
        navbarRight.innerHTML = `
          <form class="navbar-form navbar-right" role="form" id="logout-form">
            <span style="color: #bbb; margin-right: 15px; font-weight: bold;">User: ${username} ${isAdmin ? '(Admin)' : ''}</span>
            <input type="submit" class="btn btn-success" value="Sign-out">
          </form>
        `;
        document.getElementById("logout-form").addEventListener("submit", function(e) {
          e.preventDefault();
          localStorage.removeItem("demo_username");
          localStorage.removeItem("demo_is_admin");
          window.location.href = "index.html";
        });
      } else {
        navbarRight.innerHTML = `
          <form class="navbar-form navbar-right" role="form" id="login-form">
            <div class="form-group">
              <input type="text" placeholder="Email (admin@gym.com or guest@gym.com)" class="form-control" name="email" id="login-email" required style="width: 260px;">
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" class="form-control" name="password" id="login-password" required style="width: 100px;">
            </div>
            <input type="submit" class="btn btn-success" value="Sign in">
            <a href="register.html" class="btn btn-primary" style="margin-left: 5px;">Register</a>
          </form>
        `;
        document.getElementById("login-form").addEventListener("submit", function(e) {
          e.preventDefault();
          const email = document.getElementById("login-email").value.trim().toLowerCase();
          if (email === "admin@gym.com" || email === "admin") {
            localStorage.setItem("demo_username", "admin");
            localStorage.setItem("demo_is_admin", "true");
            window.location.href = "admin.html";
          } else if (email) {
            const userPart = email.split("@")[0];
            localStorage.setItem("demo_username", userPart);
            localStorage.setItem("demo_is_admin", "false");
            // Check if member already exists in local database, if not, add them
            let members = JSON.parse(localStorage.getItem("gym_members"));
            if (!members.find(m => m.username === userPart)) {
              members.push({
                id: members.length + 1,
                username: userPart,
                email: email,
                pect: 0,
                paid: false
              });
              localStorage.setItem("gym_members", JSON.stringify(members));
            }
            window.location.href = "profile.html";
          }
        });
      }
    }
  }

  function isActive(pageName) {
    const loc = window.location.pathname;
    if (loc === "/" || loc.endsWith("/") || loc.endsWith("index.html")) {
      return pageName === "index.html" ? "active" : "";
    }
    return loc.endsWith(pageName) ? "active" : "";
  }

  // 3. Page specific handlers

  function handleRegisterPage() {
    if (username) {
      window.location.href = "profile.html";
      return;
    }
    const form = document.getElementById("register-form");
    if (form) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        const user = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirmpwd").value;

        if (password !== confirm) {
          alert("Passwords do not match!");
          return;
        }

        let members = JSON.parse(localStorage.getItem("gym_members"));
        if (members.find(m => m.username.toLowerCase() === user.toLowerCase())) {
          alert("Username already exists!");
          return;
        }

        members.push({
          id: members.length + 1,
          username: user,
          email: email,
          pect: 0,
          paid: false
        });
        localStorage.setItem("gym_members", JSON.stringify(members));

        alert("Registration Successful! Please log in using the navbar.");
        window.location.href = "index.html";
      });
    }
  }

  function handleProfilePage() {
    if (!username) {
      window.location.href = "index.html";
      return;
    }
    let members = JSON.parse(localStorage.getItem("gym_members"));
    let curMember = members.find(m => m.username === username);

    const profName = document.getElementById("prof-username");
    const profEmail = document.getElementById("prof-email");
    const profPaid = document.getElementById("prof-paid");
    const profPect = document.getElementById("prof-attendance");

    if (profName) profName.innerText = username;
    if (profEmail && curMember) profEmail.innerText = curMember.email;
    if (profPect && curMember) profPect.innerText = curMember.pect + "%";
    if (profPaid && curMember) {
      profPaid.innerText = curMember.paid ? "Paid" : "Unpaid";
      profPaid.className = curMember.paid ? "label label-success" : "label label-danger";
    }

    const editForm = document.getElementById("profile-edit-form");
    if (editForm) {
      const editEmail = document.getElementById("edit-email");
      if (editEmail && curMember) editEmail.value = curMember.email;

      editForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (curMember) {
          curMember.email = editEmail.value.trim();
          localStorage.setItem("gym_members", JSON.stringify(members));
          alert("Profile updated successfully!");
          window.location.reload();
        }
      });
    }
  }

  function handleWorkoutsPage() {
    if (!username) {
      window.location.href = "index.html";
      return;
    }
    let workouts = JSON.parse(localStorage.getItem("gym_workouts")) || {};
    let userWorkouts = workouts[username] || [];

    const list = document.getElementById("workout-list");
    if (list) {
      if (userWorkouts.length === 0) {
        list.innerHTML = `<li class="list-group-item text-muted">No workouts added yet. Set your daily routine below!</li>`;
      } else {
        list.innerHTML = userWorkouts.map((w, idx) => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${w}
            <button class="btn btn-xs btn-danger pull-right delete-workout" data-index="${idx}">Delete</button>
          </li>
        `).join("");
      }

      // Add delete handler
      document.querySelectorAll(".delete-workout").forEach(btn => {
        btn.addEventListener("click", function() {
          const idx = parseInt(this.getAttribute("data-index"));
          userWorkouts.splice(idx, 1);
          workouts[username] = userWorkouts;
          localStorage.setItem("gym_workouts", JSON.stringify(workouts));
          handleWorkoutsPage(); // refresh
        });
      });
    }

    const addForm = document.getElementById("workout-add-form");
    if (addForm) {
      addForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const detail = document.getElementById("workout-detail").value.trim();
        if (detail) {
          userWorkouts.push(detail);
          workouts[username] = userWorkouts;
          localStorage.setItem("gym_workouts", JSON.stringify(workouts));
          document.getElementById("workout-detail").value = "";
          handleWorkoutsPage(); // refresh
        }
      });
    }
  }

  function handleAttendancePage() {
    if (!username) {
      window.location.href = "index.html";
      return;
    }
    let members = JSON.parse(localStorage.getItem("gym_members"));
    let curMember = members.find(m => m.username === username);

    const fillProgress = document.getElementById("attendance-progress");
    const labelPect = document.getElementById("attendance-label");

    if (curMember) {
      const pct = curMember.pect || 0;
      if (fillProgress) {
        fillProgress.style.width = pct + "%";
        fillProgress.setAttribute("aria-valuenow", pct);
      }
      if (labelPect) {
        labelPect.innerText = `Current attendance rate: ${pct}%`;
      }
    }
  }

  function handleAdminPage() {
    if (!isAdmin) {
      window.location.href = "profile.html";
      return;
    }

    let members = JSON.parse(localStorage.getItem("gym_members"));
    const tableBody = document.getElementById("admin-members-table");
    const unpaidCount = document.getElementById("admin-unpaid-count");

    if (unpaidCount) {
      const count = members.filter(m => !m.paid).length;
      unpaidCount.innerText = count;
    }

    if (tableBody) {
      tableBody.innerHTML = members.map(m => `
        <tr>
          <td>${m.id}</td>
          <td>${m.username}</td>
          <td>${m.email}</td>
          <td>${m.pect}%</td>
          <td>
            <span class="label ${m.paid ? 'label-success' : 'label-danger'}">${m.paid ? 'Paid' : 'Unpaid'}</span>
          </td>
          <td>
            <button class="btn btn-warning btn-xs edit-member" data-username="${m.username}">Edit Email</button>
            <button class="btn btn-danger btn-xs delete-member" data-username="${m.username}">Delete</button>
          </td>
        </tr>
      `).join("");

      // Bind actions
      document.querySelectorAll(".edit-member").forEach(btn => {
        btn.addEventListener("click", function() {
          const user = this.getAttribute("data-username");
          const target = members.find(m => m.username === user);
          const newEmail = prompt(`Edit email address for ${user}:`, target.email);
          if (newEmail !== null && newEmail.trim() !== "") {
            target.email = newEmail.trim();
            localStorage.setItem("gym_members", JSON.stringify(members));
            window.location.reload();
          }
        });
      });

      document.querySelectorAll(".delete-member").forEach(btn => {
        btn.addEventListener("click", function() {
          const user = this.getAttribute("data-username");
          if (confirm(`Are you sure you want to delete ${user}?`)) {
            members = members.filter(m => m.username !== user);
            // Re-index IDs
            members.forEach((m, idx) => m.id = idx + 1);
            localStorage.setItem("gym_members", JSON.stringify(members));
            window.location.reload();
          }
        });
      });
    }

    // Set Attendance Panel Form
    const attForm = document.getElementById("mark-attendance-form");
    if (attForm) {
      attForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const user = document.getElementById("att-username").value.trim().toLowerCase();
        const mode = document.getElementById("att-mode").value; // "present" or "absent"

        let target = members.find(m => m.username.toLowerCase() === user);
        if (!target) {
          alert(`User "${user}" not found!`);
          return;
        }

        if (mode === "present") {
          target.pect = Math.min(100, (target.pect || 0) + 5);
          alert(`Marked "${user}" present. Attendance increased by 5%.`);
        } else {
          target.pect = Math.max(0, (target.pect || 0) - 5);
          alert(`Marked "${user}" absent. Attendance decreased by 5%.`);
        }

        localStorage.setItem("gym_members", JSON.stringify(members));
        window.location.reload();
      });
    }

    // Set Payment Form
    const payForm = document.getElementById("make-payment-form");
    if (payForm) {
      payForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const user = document.getElementById("pay-username").value.trim().toLowerCase();
        const price = document.getElementById("pay-price").value.trim();
        const vat = document.getElementById("pay-vat").value.trim();
        const invoiceNum = document.getElementById("pay-invoice").value.trim();

        let target = members.find(m => m.username.toLowerCase() === user);
        if (!target) {
          alert(`User "${user}" not found!`);
          return;
        }

        target.paid = true;
        localStorage.setItem("gym_members", JSON.stringify(members));

        // Generate dynamic mock invoice details
        const invoiceHTML = `
=============================================
             INVOICE RECEIPT
=============================================
Invoice Number: ${invoiceNum}
Date: ${new Date().toLocaleDateString()}
---------------------------------------------
Gym Branch: Tamil Nadu
Developer: Vijay Mahes (vijaymahes9080@gmail.com)
Tel: 9080441431 & 9025388991
---------------------------------------------
Member Username: ${target.username}
Member Email: ${target.email}
---------------------------------------------
Item                       Price
---------------------------------------------
Member Plan FEE            ${price} Rs
VAT                        ${vat} Rs
---------------------------------------------
TOTAL AMOUNT               ${parseFloat(price) + parseFloat(vat)} Rs
---------------------------------------------
Payment Status: PAID
=============================================
Thank you for training with About Fitness!
        `;

        // Output simulated invoice download
        const blob = new Blob([invoiceHTML], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invoice_${invoiceNum}_${target.username}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`Payment successful! Invoice PDF generated and downloaded statically for "${target.username}".`);
        window.location.reload();
      });
    }
  }
});
