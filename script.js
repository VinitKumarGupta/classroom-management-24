// Function to check if selected date is today's date
function isToday(selectedDate) {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    return formattedToday === selectedDate;
}

// Handle Excel file upload and process attendance data
document.getElementById('attendance-upload').addEventListener('change', function() {
    const file = this.files[0];
    const classSelection = document.getElementById('class-selection').value;
    const date = document.getElementById('date-picker').value;

    // Check if a class and file are selected
    if (!classSelection) {
        alert('Please select a class!');
        return;
    }

    if (!date) {
        alert('Please select a date!');
        return;
    }

    if (!file) {
        alert('Please upload an attendance sheet!');
        return;
    }

    // Read the Excel file
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assume the first sheet contains attendance data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const attendanceData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Process the attendance data
        processAttendanceData(classSelection, date, attendanceData);
    };
    reader.readAsArrayBuffer(file);
});

// Function to process attendance data for the selected class and date
function processAttendanceData(classSelection, date, attendanceData) {
    // Display the class and date for which the attendance is being uploaded
    console.log(`Processing attendance for class: ${classSelection} on date: ${date}`);

    // Loop through attendanceData and process each row
    attendanceData.forEach((row, index) => {
        if (index === 0) {
            // Skip the header row, assuming the first row is the header
            return;
        }

        const studentName = row[0];
        const attendanceStatus = row[1]; // Assuming second column is attendance status (Present/Absent)

        // Example logic: Print or send the data to the server
        console.log(`Student: ${studentName}, Status: ${attendanceStatus}`);
    });

    alert(`Attendance data for class ${classSelection} on ${date} has been processed successfully!`);
}

// Handle class selection and date change for better UI
document.getElementById('class-selection').addEventListener('change', function() {
    const selectedClass = this.value;
    console.log(`Class selected: ${selectedClass}`);
});

// Handle date change and update dashboard title accordingly
document.getElementById('date-picker').addEventListener('change', function() {
    const selectedDate = this.value;
    const dashboardTitle = document.getElementById('dashboard-title');

    if (isToday(selectedDate)) {
        dashboardTitle.textContent = 'Dashboard (Today)';
    } else {
        dashboardTitle.textContent = `Dashboard (${selectedDate})`;
    }

    console.log(`Date selected: ${selectedDate}`);
});

// Example function for submitting attendance data to the server (if needed)
function submitAttendanceData(classSelection, date, attendanceData) {
    const formData = new FormData();
    formData.append('class', classSelection);
    formData.append('date', date);
    formData.append('attendanceData', JSON.stringify(attendanceData));

    fetch('/upload-attendance', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server Response:', data);
        alert('Attendance data submitted successfully.');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
// Function to check if the selected date is today
function isToday(selectedDate) {
    const today = new Date();
    const selected = new Date(selectedDate);
    
    // Check if both the day, month, and year match
    return today.getDate() === selected.getDate() &&
           today.getMonth() === selected.getMonth() &&
           today.getFullYear() === selected.getFullYear();
}

// Format date to DD/MM/YYYY
function formatDateToDDMMYYYY(selectedDate) {
    const date = new Date(selectedDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Handle date change and update dashboard title accordingly
document.getElementById('date-picker').addEventListener('change', function() {
    const selectedDate = this.value;
    const dashboardTitle = document.getElementById('dashboard-title');

    if (isToday(selectedDate)) {
        dashboardTitle.textContent = 'Dashboard (Today)';
    } else {
        dashboardTitle.textContent = `Dashboard (${formatDateToDDMMYYYY(selectedDate)})`;
    }
    
    console.log(`Date selected: ${selectedDate}`);
});

// Set default title as 'Today' on page load if today is selected
document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('date-picker');
    const dashboardTitle = document.getElementById('dashboard-title');
    
    if (isToday(datePicker.value)) {
        dashboardTitle.textContent = 'Dashboard (Today)';
    } else if (datePicker.value) {
        dashboardTitle.textContent = `Dashboard (${formatDateToDDMMYYYY(datePicker.value)})`;
    }
});
// Handle announcement posting
function handleAnnouncements() {
    const announcementInput = document.getElementById('announcement-input');
    const announcementDeadline = document.getElementById('announcement-deadline');
    const postAnnouncementBtn = document.getElementById('post-announcement-btn');
    const announcementDisplay = document.getElementById('announcement-display');

    postAnnouncementBtn.addEventListener('click', function () {
        const announcementText = announcementInput.value.trim();
        const deadlineDate = announcementDeadline.value;

        if (announcementText === '' || !deadlineDate) {
            alert('New Announcement Made!');
            return;
        }

        const deadlineFormatted = formatDateToDDMMYYYY(deadlineDate);
        const announcementCard = document.createElement('div');
        announcementCard.className = 'announcement-card';
        announcementCard.innerHTML = `
            <p>${announcementText}</p>
            <p>Deadline: ${deadlineFormatted}</p>
        `;

        // Clear the input fields after posting
        announcementInput.value = ''; 
        announcementDeadline.value = ''; 

        // Check if the display is empty and update it
        if (announcementDisplay.innerHTML === '<p>No Announcements</p>') {
            announcementDisplay.innerHTML = ''; // Clear no announcement message
        }

        announcementDisplay.appendChild(announcementCard);
    });
}

// Initialize the application
function init() {
    handleAnnouncements();
}

// Call the init function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
document.getElementById('post-announcement-btn').addEventListener('click', function() {
    const announcementText = document.getElementById('announcement-input').value;
    const announcementDeadline = document.getElementById('announcement-deadline').value;

    

    const deadlineFormatted = new Date(announcementDeadline).toLocaleDateString();

    // Create announcement card
    const announcementCard = document.createElement('div');
    announcementCard.className = 'announcement-card';
    announcementCard.innerHTML = `
        <div class="announcement-text-container">
            <p class="announcement-text">${announcementText}</p>
            <p class="announcement-deadline">Deadline: ${deadlineFormatted}</p>
        </div>
        <button class="delete-announcement-btn">
            <img src="https://img.icons8.com/ios-glyphs/30/000000/trash.png" alt="Delete">
        </button>
    `;

    // Append the announcement card to the display
    document.getElementById('announcement-display').appendChild(announcementCard);

    // Add delete functionality to the button
    announcementCard.querySelector('.delete-announcement-btn').addEventListener('click', function() {
        announcementCard.remove();
    });

    // Clear input fields after posting the announcement
    document.getElementById('announcement-input').value = '';
    document.getElementById('announcement-deadline').value = '';
});
// Function to update the student profile count
function updateStudentProfileCount() {
    const studentProfileCount = document.querySelectorAll('.profile-card').length;
    document.getElementById('student-profile-count').textContent = studentProfileCount;
}

// Function to update the announcement count
function updateAnnouncementCount() {
    const announcementCount = document.querySelectorAll('.announcement-item').length;
    document.getElementById('announcement-count').textContent = announcementCount;
}

// Call these functions initially to set the counts based on existing data
updateStudentProfileCount();
updateAnnouncementCount();

// Example: Add a new student profile dynamically
function addStudentProfile(name, grade) {
    const profileContainer = document.querySelector('.student-profiles');
    const newProfile = document.createElement('div');
    newProfile.classList.add('profile-card');
    newProfile.innerHTML = `
        <img src="https://via.placeholder.com/100" alt="${name}">
        <p>${name}</p>
        <p>Grade: ${grade}</p>
    `;
    profileContainer.appendChild(newProfile);
    updateStudentProfileCount(); // Update the count after adding
}

// Example: Add a new announcement dynamically
function addAnnouncement(text, date) {
    const announcementContainer = document.getElementById('announcement-display');
    const newAnnouncement = document.createElement('div');
    newAnnouncement.classList.add('announcement-item');
    newAnnouncement.innerHTML = `
        <p>${text}</p>
        <p>Due: ${date}</p>
    `;
    announcementContainer.appendChild(newAnnouncement);
    updateAnnouncementCount(); // Update the count after adding
}

// Example of removing a profile (you can call this function in your removal logic)
function removeStudentProfile(profileIndex) {
    const profiles = document.querySelectorAll('.profile-card');
    if (profiles[profileIndex]) {
        profiles[profileIndex].remove();
        updateStudentProfileCount(); // Update the count after removal
    }
}

// Example of removing an announcement (you can call this function in your removal logic)
function removeAnnouncement(announcementIndex) {
    const announcements = document.querySelectorAll('.announcement-item');
    if (announcements[announcementIndex]) {
        announcements[announcementIndex].remove();
        updateAnnouncementCount(); // Update the count after removal
    }
}
// Student profile count logic
const studentProfileCountElement = document.getElementById('student-profile-count');
let studentProfileCount = 3; // Initial value based on your HTML

// Announcement count logic
const announcementCountElement = document.getElementById('announcement-count');
let announcementCount = 0; // Starting from 0

// Post Announcement Button logic
const postAnnouncementBtn = document.getElementById('post-announcement-btn');
const announcementInput = document.getElementById('announcement-input');
const announcementDisplay = document.getElementById('announcement-display');

// Function to add new announcement
function addAnnouncement() {
    const announcementText = announcementInput.value.trim();
    if (announcementText !== '') {
        // Create a new announcement element
        const newAnnouncement = document.createElement('p');
        newAnnouncement.textContent = announcementText;
        announcementDisplay.appendChild(newAnnouncement);

        // Increment the announcement count
        announcementCount++;
        announcementCountElement.textContent = announcementCount;

        // Clear the input field
        announcementInput.value = '';
    }
}

// Event listener for the Post Announcement button
postAnnouncementBtn.addEventListener('click', addAnnouncement);
