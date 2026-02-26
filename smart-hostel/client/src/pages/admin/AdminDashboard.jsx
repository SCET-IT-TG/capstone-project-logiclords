<form onSubmit={handleCreate}>
  <input name="name" />
  <input name="email" />
  <input name="password" />
  <select name="role">
    <option value="student">Student</option>
    <option value="warden">Warden</option>
  </select>
  <button>Create User</button>
</form>