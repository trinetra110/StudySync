const STORAGE_KEY = "studysync-data";
const STORAGE_VERSION = "studysync-data-version";
const emptyData = { users: [], assignments: [], submissions: [] };
function readData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored || localStorage.getItem(STORAGE_VERSION) !== "2") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
    localStorage.setItem(STORAGE_VERSION, "2");
    return emptyData;
  }
  return JSON.parse(stored);
}
function writeData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}
export const getUsers = () => readData().users;
export const getStudents = () =>
  getUsers().filter((user) => user.role === "student");
export const getAssignments = () => readData().assignments;
export const getSubmissions = () => readData().submissions;
export function authenticate(email, password) {
  const user = readData().users.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!user || user.password !== password)
    return { error: "That email and password combination was not found." };
  return { user };
}
export function registerUser({ name, email, password, role }) {
  const data = readData();
  if (
    data.users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
    )
  )
    return { error: "An account with that email already exists." };
  const user = {
    id: `${role}-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role,
  };
  writeData({ ...data, users: [...data.users, user] });
  return { user };
}
export function createAssignment(assignment) {
  const data = readData();
  const created = { ...assignment, id: `assignment-${Date.now()}` };
  writeData({ ...data, assignments: [...data.assignments, created] });
  return created;
}
export function markSubmission(assignmentId, studentId, response = "") {
  const data = readData();
  const existing = data.submissions.find(
    (item) =>
      item.assignmentId === assignmentId && item.studentId === studentId,
  );
  const submissions = existing
    ? data.submissions.map((item) =>
        item === existing
          ? { ...item, isSubmitted: true, response: response.trim() }
          : item,
      )
    : [
        ...data.submissions,
        {
          assignmentId,
          studentId,
          isSubmitted: true,
          response: response.trim(),
        },
      ];
  writeData({ ...data, submissions });
}
export function deleteAssignment(assignmentId, adminId) {
  const data = readData();
  const assignment = data.assignments.find((item) => item.id === assignmentId);
  if (!assignment || assignment.adminId !== adminId) return false;
  writeData({
    ...data,
    assignments: data.assignments.filter((item) => item.id !== assignmentId),
    submissions: data.submissions.filter(
      (item) => item.assignmentId !== assignmentId,
    ),
  });
  return true;
}
