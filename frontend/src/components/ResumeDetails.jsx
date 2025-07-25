const ResumeDetails = ({ resume }) => {
  if (!resume) return null;
  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{resume.name || 'N/A'}</h2>
      <div className="mb-4">
        <p className="text-gray-600"><strong>Email:</strong> {resume.email || 'N/A'}</p>
        <p className="text-gray-600"><strong>Phone:</strong> {resume.phone || 'N/A'}</p>
        <p className="text-gray-600"><strong>Rating:</strong> <span className="font-semibold text-blue-600">{resume.resume_rating}/10</span></p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Technical Skills</h3>
        {resume.technical_skills?.length ? (
          <ul className="list-disc list-inside ml-4">
            {resume.technical_skills.map((skill, i) => (
              <li key={i} className="text-gray-700">{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">N/A</p>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Improvement Areas</h3>
        <p className="text-gray-700">{resume.improvement_areas || 'N/A'}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Upskill Suggestions</h3>
        {resume.upskill_suggestions?.length ? (
          <ul className="list-disc list-inside ml-4">
            {resume.upskill_suggestions.map((sug, i) => (
              <li key={i} className="text-gray-700">{sug}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">N/A</p>
        )}
      </div>
    </div>
  );
};

export default ResumeDetails;