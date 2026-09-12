import React, { useState } from 'react';
import { TrophyIcon, SearchIcon, ArrowRightIcon, UsersIcon, CheckIcon } from '../../components/common/Icons';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';

export default function StudentCompetitions() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [activeModal, setActiveModal] = useState(null); // 'register' | 'guidelines'
  const [selectedComp, setSelectedComp] = useState(null);

  const [regForm, setRegForm] = useState({
    teamName: '',
    track: 'AI & Web Agents',
    members: 'Alex Vance (Lead), Maya Lin',
    github: ''
  });

  const competitions = [
    {
      id: 1,
      title: "Annual Hackathon Sprint 2026",
      club: "Computer Science Society",
      date: "Oct 12 - 14, 2026",
      category: "Tech",
      prize: "$5,000",
      tags: ['Coding', 'Web3', 'AI'],
      desc: "Build full-stack autonomous AI applications and distributed web tools in 36 continuous hours."
    },
    {
      id: 2,
      title: "All-Campus Debate Championship",
      club: "Literary & Oratory Guild",
      date: "Sept 20, 2026",
      category: "Literary",
      prize: "$1,500",
      tags: ['Debate', 'Speaking'],
      desc: "Parliamentary style collegiate debate covering future tech ethics, global trade, and policy."
    },
    {
      id: 3,
      title: "RoboWars: Steel Arena Combat",
      club: "Robotics Club",
      date: "Oct 05, 2026",
      category: "Robotics",
      prize: "$3,000",
      tags: ['Hardware', 'Combat'],
      desc: "Design and pilot 15kg combat bots in custom hazardous battle rings with live scoring."
    },
    {
      id: 4,
      title: "Campus Esports Invitational",
      club: "Gaming Syndicate",
      date: "Oct 22, 2026",
      category: "Gaming",
      prize: "$2,000",
      tags: ['Esports', 'Multiplayer'],
      desc: "5v5 tactical tournament broadcasted live across university streaming auditoriums."
    }
  ];

  const filtered = competitions.filter(c => {
    const matchCat = category === 'All' || c.category === category;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.club.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regForm.teamName) return;
    showToast(`Team "${regForm.teamName}" registered for ${selectedComp.title}!`, 'success');
    setActiveModal(null);
    setRegForm({ teamName: '', track: 'AI & Web Agents', members: 'Alex Vance (Lead), Maya Lin', github: '' });
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Competitions & Grand Tournaments</h1>
          <p className="page-description">Register as an individual or mobilize a team to represent your department.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 form-input" style={{ width: '280px', padding: '8px 14px' }}>
            <SearchIcon className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search competitions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'inherit' }}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['All', 'Tech', 'Robotics', 'Literary', 'Gaming'].map(cat => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filtered.map(comp => (
          <div 
            key={comp.id} 
            className="card flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="badge badge-purple">{comp.category}</span>
                <span className="badge badge-success">Prize: {comp.prize}</span>
              </div>
              <h3 className="text-xl font-black mb-1">{comp.title}</h3>
              <p className="text-xs text-muted mb-4">
                {comp.club} • <strong>{comp.date}</strong>
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {comp.desc}
              </p>
            </div>

            <div>
              <div className="flex gap-1.5 mb-6">
                {comp.tags.map(tag => (
                  <span key={tag} className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  className="btn btn-outline btn-sm flex-1"
                  onClick={() => {
                    setSelectedComp(comp);
                    setActiveModal('guidelines');
                  }}
                >
                  Guidelines
                </button>
                <button 
                  className="btn btn-primary btn-sm flex-1"
                  onClick={() => {
                    setSelectedComp(comp);
                    setActiveModal('register');
                  }}
                >
                  <span>Register Team</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Register Team */}
      {selectedComp && (
        <Modal
          isOpen={activeModal === 'register'}
          onClose={() => setActiveModal(null)}
          title={`Register: ${selectedComp.title}`}
          subtitle={`Organized by ${selectedComp.club} • Grand Prize: ${selectedComp.prize}`}
          size="md"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRegisterSubmit}>Confirm Registration</button>
            </>
          }
        >
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Team Designation</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Quantum Pioneers" 
                value={regForm.teamName}
                onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Track / Theme Focus</label>
              <select 
                className="form-select"
                value={regForm.track}
                onChange={(e) => setRegForm({ ...regForm, track: e.target.value })}
              >
                <option>AI & Autonomous Agents</option>
                <option>Campus Sustainability Tech</option>
                <option>Fintech & Web3 Distributed Ledgers</option>
                <option>Healthcare & Biomedical Devices</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Team Members (IDs / Names)</label>
              <input 
                type="text" 
                className="form-input" 
                value={regForm.members}
                onChange={(e) => setRegForm({ ...regForm, members: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Project Abstract / Repository Link</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://github.com/team/project-brief"
                value={regForm.github}
                onChange={(e) => setRegForm({ ...regForm, github: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL: Guidelines */}
      {selectedComp && (
        <Modal
          isOpen={activeModal === 'guidelines'}
          onClose={() => setActiveModal(null)}
          title={`Rules & Guidelines: ${selectedComp.title}`}
          subtitle="Official collegiate tournament handbook"
          size="md"
          footer={
            <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Understood & Accept</button>
          }
        >
          <div className="flex flex-col gap-3 py-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            <p><strong>1. Eligibility:</strong> Open to all currently enrolled undergraduate and graduate students with active university identity cards.</p>
            <p><strong>2. Originality:</strong> All source code, CAD blueprints, and competition deliverables must be created within the scheduled timeline.</p>
            <p><strong>3. Honor Code:</strong> Plagiarism or external developer assistance will result in instant team disqualification and forfeiture of campus activity credits.</p>
            <p><strong>4. Equipment:</strong> Wi-Fi, power hubs, and cloud server credits will be provided on-site in Innovation Hall.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
