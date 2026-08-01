import { useMemo, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Pencil,
  Shield,
  KeyRound,
  HardDrive,
  Trash2,
  LogOut,
  Globe,
  CalendarDays,
  Clock3,
  ChevronRight,
  ArrowUpRight,
  Languages,
  Bell,
  MailCheck,
  Smartphone,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

import './SettingsPage.css'

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`em-toggle ${checked ? 'on' : 'off'}`}
      aria-pressed={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span className="em-toggle-track" />
      <span className="em-toggle-thumb" />
    </button>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: 'Vasudha Sharma',
    username: 'vasudha',
    email: 'vasudha@example.com',
    phone: '+91 98765 43210',
    college: 'Tech University',
    degree: 'B.Tech',
    branch: 'Computer Science',
    gradYear: '2026',
    bio: 'Building my future with skills, projects, and interview-ready practice.'
  })

  const graduationYears = useMemo(
    () => ['2024', '2025', '2026', '2027', '2028'],
    []
  )

  const [twoFactor, setTwoFactor] = useState(true)

  const [notification, setNotification] = useState({
    email: true,
    push: false,
    dailyReminder: true,
    weeklyReport: true,
    resumeTips: false,
    newCourseAlerts: true,
    interviewReminder: true,
    codingReminder: false,
  })

  const updateField = (key, value) => setProfile((p) => ({ ...p, [key]: value }))

  return (
    <div className="settings-page" aria-label="Settings">
      <div className="settings-hero">
        <div>
          <div className="settings-breadcrumb">
            <Sparkles size={16} className="settings-breadcrumb-icon" />
            <span>EduMind</span>
          </div>
          <h1 className="settings-title">⚙️ Settings</h1>
          <p className="settings-subtitle">Manage your account, preferences, and notifications.</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* CARD 1 */}
        <section className="settings-card">
          <div className="card-head">
            <div className="card-head-left">
              <div className="card-icon pill">
                <User size={18} />
              </div>
              <div>
                <h2 className="card-title">Profile Settings</h2>
                <p className="card-subtitle">Keep your details up to date for a better experience.</p>
              </div>
            </div>
          </div>

          <div className="profile-top">
            <div className="avatar-upload">
              <div className="avatar-ring">
                <div className="avatar-preview" aria-label="Profile picture">
                  <User size={34} />
                </div>
              </div>
              <label className="upload-cta">
                <Pencil size={16} />
                Upload
                <input type="file" accept="image/*" />
              </label>
            </div>
          </div>

          <div className="form-grid">
            <Field icon={User} label="Full Name">
              <input
                value={profile.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="em-input"
              />
            </Field>

            <Field icon={User} label="Username">
              <input
                value={profile.username}
                onChange={(e) => updateField('username', e.target.value)}
                className="em-input"
              />
            </Field>

            <Field icon={Mail} label="Email Address">
              <input
                value={profile.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="em-input"
              />
            </Field>

            <Field icon={Phone} label="Phone Number">
              <input
                value={profile.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="em-input"
              />
            </Field>

            <Field icon={Building2} label="College / University">
              <input
                value={profile.college}
                onChange={(e) => updateField('college', e.target.value)}
                className="em-input"
              />
            </Field>

            <div className="split-2">
              <Field icon={GraduationCap} label="Degree">
                <input
                  value={profile.degree}
                  onChange={(e) => updateField('degree', e.target.value)}
                  className="em-input"
                />
              </Field>
              <Field icon={GraduationCap} label="Branch">
                <input
                  value={profile.branch}
                  onChange={(e) => updateField('branch', e.target.value)}
                  className="em-input"
                />
              </Field>
            </div>

            <Field icon={CalendarDays} label="Graduation Year">
              <select
                value={profile.gradYear}
                onChange={(e) => updateField('gradYear', e.target.value)}
                className="em-select"
              >
                {graduationYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={Pencil} label="Bio / About Me">
              <textarea
                value={profile.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                className="em-textarea"
                rows={4}
              />
            </Field>
          </div>

          <div className="card-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                // mock submit
              }}
            >
              Save Changes
              <ArrowUpRight size={18} />
            </button>
          </div>
        </section>

        {/* CARD 2 */}
        <section className="settings-card">
          <div className="card-head">
            <div className="card-head-left">
              <div className="card-icon pill">
                <Shield size={18} />
              </div>
              <div>
                <h2 className="card-title">Account Settings</h2>
                <p className="card-subtitle">Security and session controls for your workspace.</p>
              </div>
            </div>
          </div>

          <div className="rows">
            <Row
              icon={KeyRound}
              title="Change Password"
              onClick={() => {}}
            />

            <div className="row row-toggle">
              <div className="row-left">
                <div className="row-icon pill purple">
                  <KeyRound size={18} />
                </div>
                <div className="row-text">
                  <div className="row-title">Two-Factor Authentication</div>
                  <div className="row-desc">Add an extra layer of protection.</div>
                </div>
              </div>
              <Toggle
                checked={twoFactor}
                onChange={setTwoFactor}
                label="Two-Factor Authentication"
              />
            </div>

            <Row
              icon={HardDrive}
              title="Login Activity"
              onClick={() => {}}
            />

            <Row
              icon={Smartphone}
              title="Manage Devices"
              onClick={() => {}}
            />

            <button type="button" className="danger-row">
              <div className="row-left">
                <div className="row-icon pill danger">
                  <Trash2 size={18} />
                </div>
                <div>
                  <div className="row-title danger">Delete Account</div>
                  <div className="row-desc">Permanently remove your EduMind data.</div>
                </div>
              </div>
            </button>

            <Row
              icon={LogOut}
              title="Logout from All Devices"
              onClick={() => {}}
            />
          </div>
        </section>

        {/* CARD 3 */}
        <section className="settings-card">
          <div className="card-head">
            <div className="card-head-left">
              <div className="card-icon pill">
                <Languages size={18} />
              </div>
              <div>
                <h2 className="card-title">Language &amp; Region</h2>
                <p className="card-subtitle">Personalize how time and content are displayed.</p>
              </div>
            </div>
          </div>

          <div className="form-grid region-grid">
            <Field icon={Globe} label="Language Selection">
              <select className="em-select" defaultValue="English">
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
                <option>Spanish</option>
              </select>
            </Field>

            <Field icon={Clock3} label="Time Zone">
              <select className="em-select" defaultValue="(GMT+05:30) India">
                <option>(GMT+05:30) India</option>
                <option>(GMT+00:00) UTC</option>
                <option>(GMT-04:00) New York</option>
                <option>(GMT+01:00) Berlin</option>
              </select>
            </Field>

            <Field icon={Globe} label="Country">
              <select className="em-select" defaultValue="India">
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
            </Field>

            <Field icon={CalendarDays} label="Date Format">
              <select className="em-select" defaultValue="MM/DD/YYYY">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </Field>

            <Field icon={Clock3} label="Time Format (12/24 Hour)">
              <select className="em-select" defaultValue="24-hour">
                <option>12-hour</option>
                <option>24-hour</option>
              </select>
            </Field>
          </div>
        </section>

        {/* CARD 4 */}
        <section className="settings-card">
          <div className="card-head">
            <div className="card-head-left">
              <div className="card-icon pill">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="card-title">Notifications</h2>
                <p className="card-subtitle">Choose how and when you want to hear from EduMind.</p>
              </div>
            </div>
          </div>

          <div className="notif-list">
            <NotifItem
              icon={MailCheck}
              title="Email Notifications"
              desc="Important updates and reminders via email."
              checked={notification.email}
              onChange={(v) => setNotification((n) => ({ ...n, email: v }))}
            />

            <NotifItem
              icon={Sparkles}
              title="Push Notifications"
              desc="Personalized alerts on your device."
              checked={notification.push}
              onChange={(v) => setNotification((n) => ({ ...n, push: v }))}
            />

            <NotifItem
              icon={Bell}
              title="Daily Study Reminder"
              desc="A nudge to keep your learning streak active."
              checked={notification.dailyReminder}
              onChange={(v) => setNotification((n) => ({ ...n, dailyReminder: v }))}
            />

            <NotifItem
              icon={CalendarDays}
              title="Weekly Progress Report"
              desc="A weekly summary of your momentum and wins."
              checked={notification.weeklyReport}
              onChange={(v) => setNotification((n) => ({ ...n, weeklyReport: v }))}
            />

            <NotifItem
              icon={Pencil}
              title="Resume Tips"
              desc="Actionable suggestions to improve your resume."
              checked={notification.resumeTips}
              onChange={(v) => setNotification((n) => ({ ...n, resumeTips: v }))}
            />

            <NotifItem
              icon={Sparkles}
              title="New Course Alerts"
              desc="Discover new learning paths aligned with your goals."
              checked={notification.newCourseAlerts}
              onChange={(v) => setNotification((n) => ({ ...n, newCourseAlerts: v }))}
            />

            <NotifItem
              icon={KeyRound}
              title="Interview Reminder"
              desc="Stay prepared with scheduled interview prompts."
              checked={notification.interviewReminder}
              onChange={(v) => setNotification((n) => ({ ...n, interviewReminder: v }))}
            />

            <NotifItem
              icon={HardDrive}
              title="Coding Challenge Reminder"
              desc="Get notified when new challenges drop."
              checked={notification.codingReminder}
              onChange={(v) => setNotification((n) => ({ ...n, codingReminder: v }))}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="field">
      <div className="field-label">
        <span className="field-icon">
          <Icon size={16} />
        </span>
        <span>{label}</span>
      </div>
      {children}
    </label>
  )
}

function Row({ icon: Icon, title, onClick }) {
  return (
    <button type="button" className="row" onClick={onClick}>
      <div className="row-left">
        <div className="row-icon pill">
          <Icon size={18} />
        </div>
        <div className="row-title">{title}</div>
      </div>
      <ChevronRight size={18} className="row-arrow" />
    </button>
  )
}

function NotifItem({ icon: Icon, title, desc, checked, onChange }) {
  return (
    <div className="notif-item">
      <div className="notif-left">
        <div className="notif-icon pill purple">
          <Icon size={18} />
        </div>
        <div>
          <div className="notif-title">{title}</div>
          <div className="notif-desc">{desc}</div>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  )
}

