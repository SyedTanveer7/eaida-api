const express = require('express');
const router = express.Router({
	mergeParams: true
});
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// REPORT ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
    res.json({
        sick: ['Abrasions', 'Acid Reflux', 'Allergy Symptoms - Nose/Eyes', 'Asthma Flare Up', 'Bacterial Vaginosis', 'Body Aches', 'Bronchitis', 'Bug Bites, Impetigo, Ringworm', 'Cankers in Mouth', 'Cold Sore(s)', 'Coughing', 'Dehydration', 'Diarrhea', 'Earache', 'Eye Infection, Pink Eye or Styes', 'Fever', 'Flu', 'Frostbite', 'Gout Flare Up', 'Head Lice', 'Headaches &amp; Migraines', 'Hives', 'Nasal Congestion', 'Nausea', 'Poison Ivy', 'STI Symptoms', 'Shingles', 'Sinus Infection', 'Skin Issues', 'Sore Throat', 'Sprains &amp; Strains', 'Toenail or Fingernail Infection', 'Urinary Tract Infection (UTI) Symptoms', 'Vomiting', 'Yeast Infections'],
        mental: ['Exercise Counselling','Mental Health Counselling','Naturopath - Full Consult','Naturopath - Initial Consult','Nutrition Counselling','Sleep Hygiene Counselling','Stress Reduction Counselling','Weight Loss Monitoring/Counselling'],
        naturopathic: ['Naturopath - Full Consult','Naturopath - Initial Consult'],
        ongoing: ['Acid Reflux','Acne Ongoing','Allergy Symptoms - Nose/Eyes','Asthma Flare Up','Asthma/COPD/Emphysema Ongoing','Body Aches','Cholesterol Visit','Diabetes','Erectile Dysfunction','Headaches &amp; Migraines','Hypertension (High Blood Pressure)','Insomnia','Nasal Congestion','Rash or Skin Condition','Weight Loss Monitoring/Counselling'],
        skinIssue: ['Abrasions','Acne Ongoing','Acne Symptoms','Hives','Poison Ivy','Rash or Skin Condition','Shingles','Skin Issues','Toenail or Fingernail Infection'],
        travelHealth: ['Travel Consult'],
        nursingCare: ['Elderly Care','Mother and Baby Care','Palliative Care'],
        physicalTherapist: ['Physiotherapy and rehabilitation'],
        animalCare: ['Veterinary Consultation','Pet grooming'],
        laboratory: ['ANA ( Antinuclear Antibody)','BMP ( Basic Metabolic Panel)','CBC ( Complete blood count)','CMP ( Comprehensive metabolic Panel)','ESR ( Sedimentation Rate)','Flu Test ( Influenza A &amp; B screen)','Glucose Level','HCG (Pregnancy Test)','Hemoglobin A1C','HIV antibody test','LFT (Liver Function Panel)','Lipid Panel','Lyme Antibody (Borrelia Antibody)','Microalbumin','Mononucleosis Test','Pap Smear','PSA (Prostate Specific Antigen)','PT (Prothrombin Time)','ABO Typing (Blood group test)','PTT ( Partial Thromboplastin Time)','Semen Analysis','TSH ( Thyroid Stimulating Hormone)','Urinalysis']
    })
});

module.exports = router;