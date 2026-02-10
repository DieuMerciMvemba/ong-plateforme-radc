import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  Users, 
  Edit2, 
  Save, 
  Plus, 
  Trash2, 
  Award,
  Briefcase,
  Target
} from 'lucide-react';

interface Organisation {
  id: string;
  nom: string;
  description: string;
  mission: string;
  vision: string;
  valeurs: string[];
  contact: {
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    pays: string;
    codePostal: string;
  };
  social: {
    website: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  legal: {
    statutJuridique: string;
    numeroRegistre: string;
    dateCreation: Date;
    siret?: string;
    rna?: string;
  };
  equipe: MembreEquipe[];
  departements: Departement[];
  statut: 'actif' | 'inactif' | 'suspendu';
  createdAt: Date;
  updatedAt: Date;
}

interface MembreEquipe {
  id: string;
  nom: string;
  prenom: string;
  poste: string;
  email: string;
  telephone: string;
  photo?: string;
  bio?: string;
  departement: string;
  dateEmbauche: Date;
  statut: 'actif' | 'inactif';
}

interface Departement {
  id: string;
  nom: string;
  description: string;
  responsable: string;
  effectif: number;
  budget?: number;
  missions: string[];
}

const OrganizationManagement: React.FC = () => {
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'equipe' | 'departements'>('general');
  const [formData, setFormData] = useState<Partial<Organisation>>({
    nom: 'RADC',
    description: 'Réseau d\'appui au développement communautaire',
    mission: 'Mettre en place des initiatives pour le développement communautaire',
    vision: 'Devenir un leader dans le domaine du développement communautaire',
    valeurs: ['Solidarité', 'Équité', 'Transparence'],
    contact: {
      email: 'info@radc.org',
      telephone: '514-123-4567',
      adresse: '123, rue Main',
      ville: 'Montréal',
      pays: 'Canada',
      codePostal: 'H3B 2B4'
    },
    social: {
      website: 'https://www.radc.org',
      facebook: 'https://www.facebook.com/radc.org',
      twitter: 'https://twitter.com/radc_org',
      linkedin: 'https://www.linkedin.com/company/radc-org',
      instagram: 'https://www.instagram.com/radc_org'
    },
    legal: {
      statutJuridique: 'Organisme à but non lucratif',
      numeroRegistre: '123456789',
      dateCreation: new Date('2020-01-01'),
      siret: '12345678901234',
      rna: 'W123456789'
    },
    statut: 'actif'
  });

  useEffect(() => {
    loadOrganisation();
  }, []);

  const loadOrganisation = async () => {
    try {
      const orgQuery = query(
        collection(db, 'organisation'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(orgQuery);
      if (!snapshot.empty) {
        const orgData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
          createdAt: snapshot.docs[0].data().createdAt?.toDate() || new Date(),
          updatedAt: snapshot.docs[0].data().updatedAt?.toDate() || new Date(),
          legal: {
            ...snapshot.docs[0].data().legal,
            dateCreation: snapshot.docs[0].data().legal?.dateCreation?.toDate() || new Date()
          }
        } as Organisation;
        setOrganisation(orgData);
        setFormData(orgData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const orgData = {
        ...formData,
        updatedAt: new Date(),
        ...(formData.legal && {
          legal: {
            ...formData.legal,
            dateCreation: formData.legal.dateCreation || new Date()
          }
        })
      };

      if (organisation) {
        await updateDoc(doc(db, 'organisation', organisation.id), orgData);
      } else {
        await updateDoc(doc(db, 'organisation'), {
          ...formData,
          updatedAt: new Date()
        });
      }

      setEditing(false);
      loadOrganisation();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleAddMembre = () => {
    const nouveauMembre: MembreEquipe = {
      id: Date.now().toString(),
      nom: '',
      prenom: '',
      poste: '',
      email: '',
      telephone: '',
      departement: '',
      dateEmbauche: new Date(),
      statut: 'actif'
    };

    setFormData({
      ...formData,
      equipe: [...(formData.equipe || []), nouveauMembre]
    });
  };

  const handleUpdateMembre = (index: number, field: keyof MembreEquipe, value: any) => {
    const equipe = [...(formData.equipe || [])];
    equipe[index] = { ...equipe[index], [field]: value };
    setFormData({ ...formData, equipe });
  };

  const handleDeleteMembre = (index: number) => {
    const equipe = [...(formData.equipe || [])];
    equipe.splice(index, 1);
    setFormData({ ...formData, equipe });
  };

  const handleAddDepartement = () => {
    const nouveauDepartement: Departement = {
      id: Date.now().toString(),
      nom: '',
      description: '',
      responsable: '',
      effectif: 0,
      missions: []
    };

    setFormData({
      ...formData,
      departements: [...(formData.departements || []), nouveauDepartement]
    });
  };

  const handleUpdateDepartement = (index: number, field: keyof Departement, value: any) => {
    const departements = [...(formData.departements || [])];
    departements[index] = { ...departements[index], [field]: value };
    setFormData({ ...formData, departements });
  };

  const handleDeleteDepartement = (index: number) => {
    const departements = [...(formData.departements || [])];
    departements.splice(index, 1);
    setFormData({ ...formData, departements });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion Organisationnelle</h1>
          <p className="text-gray-600">Informations sur l'organisation RADC</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Save className="h-5 w-5" />
                Sauvegarder
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit2 className="h-5 w-5" />
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Effectif Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.equipe?.filter(m => m.statut === 'actif').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Départements</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.departements?.length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Années d'existence</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.legal?.dateCreation 
                  ? new Date().getFullYear() - new Date(formData.legal.dateCreation).getFullYear()
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Statut</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {formData.statut || 'Inconnu'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Informations Générales
            </button>
            <button
              onClick={() => setActiveTab('equipe')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'equipe'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Équipe ({formData.equipe?.filter(m => m.statut === 'actif').length || 0})
            </button>
            <button
              onClick={() => setActiveTab('departements')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'departements'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Départements ({formData.departements?.length || 0})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {/* Informations de base */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'organisation</label>
                  <input
                    type="text"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <select
                    value={formData.statut || 'actif'}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!editing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mission</label>
                  <textarea
                    rows={3}
                    value={formData.mission || ''}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vision</label>
                  <textarea
                    rows={3}
                    value={formData.vision || ''}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Coordonnées</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { 
                        ...formData.contact, 
                        email: e.target.value,
                        telephone: formData.contact?.telephone || '',
                        adresse: formData.contact?.adresse || '',
                        ville: formData.contact?.ville || '',
                        pays: formData.contact?.pays || '',
                        codePostal: formData.contact?.codePostal || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.contact?.telephone || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { 
                        ...formData.contact, 
                        telephone: e.target.value,
                        email: formData.contact?.email || '',
                        adresse: formData.contact?.adresse || '',
                        ville: formData.contact?.ville || '',
                        pays: formData.contact?.pays || '',
                        codePostal: formData.contact?.codePostal || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <input
                    type="text"
                    value={formData.contact?.adresse || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { 
                        ...formData.contact, 
                        adresse: e.target.value,
                        email: formData.contact?.email || '',
                        telephone: formData.contact?.telephone || '',
                        ville: formData.contact?.ville || '',
                        pays: formData.contact?.pays || '',
                        codePostal: formData.contact?.codePostal || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <input
                    type="text"
                    value={formData.contact?.ville || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { 
                        ...formData.contact, 
                        ville: e.target.value,
                        email: formData.contact?.email || '',
                        telephone: formData.contact?.telephone || '',
                        adresse: formData.contact?.adresse || '',
                        pays: formData.contact?.pays || '',
                        codePostal: formData.contact?.codePostal || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code Postal</label>
                  <input
                    type="text"
                    value={formData.contact?.codePostal || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contact: { 
                        ...formData.contact, 
                        codePostal: e.target.value,
                        email: formData.contact?.email || '',
                        telephone: formData.contact?.telephone || '',
                        adresse: formData.contact?.adresse || '',
                        ville: formData.contact?.ville || '',
                        pays: formData.contact?.pays || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Réseaux sociaux</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Site web</label>
                  <input
                    type="url"
                    value={formData.social?.website || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      social: { 
                        ...formData.social, 
                        website: e.target.value,
                        facebook: formData.social?.facebook || '',
                        twitter: formData.social?.twitter || '',
                        linkedin: formData.social?.linkedin || '',
                        instagram: formData.social?.instagram || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="url"
                    value={formData.social?.facebook || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      social: { 
                        ...formData.social, 
                        facebook: e.target.value,
                        website: formData.social?.website || '',
                        twitter: formData.social?.twitter || '',
                        linkedin: formData.social?.linkedin || '',
                        instagram: formData.social?.instagram || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Informations légales */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations légales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut juridique</label>
                  <input
                    type="text"
                    value={formData.legal?.statutJuridique || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      legal: { 
                        ...formData.legal, 
                        statutJuridique: e.target.value,
                        numeroRegistre: formData.legal?.numeroRegistre || '',
                        dateCreation: formData.legal?.dateCreation || new Date(),
                        siret: formData.legal?.siret || '',
                        rna: formData.legal?.rna || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de registre</label>
                  <input
                    type="text"
                    value={formData.legal?.numeroRegistre || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      legal: { 
                        ...formData.legal, 
                        numeroRegistre: e.target.value,
                        statutJuridique: formData.legal?.statutJuridique || '',
                        dateCreation: formData.legal?.dateCreation || new Date(),
                        siret: formData.legal?.siret || '',
                        rna: formData.legal?.rna || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de création</label>
                  <input
                    type="date"
                    value={formData.legal?.dateCreation ? new Date(formData.legal.dateCreation).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      legal: { 
                        ...formData.legal, 
                        dateCreation: new Date(e.target.value),
                        statutJuridique: formData.legal?.statutJuridique || '',
                        numeroRegistre: formData.legal?.numeroRegistre || '',
                        siret: formData.legal?.siret || '',
                        rna: formData.legal?.rna || ''
                      }
                    })}
                    disabled={!editing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'equipe' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Équipe</h3>
            {editing && (
              <button
                onClick={handleAddMembre}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Ajouter un membre
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {formData.equipe?.map((membre, index) => (
              <div key={membre.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={membre.nom}
                      onChange={(e) => handleUpdateMembre(index, 'nom', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                      type="text"
                      value={membre.prenom}
                      onChange={(e) => handleUpdateMembre(index, 'prenom', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Poste</label>
                    <input
                      type="text"
                      value={membre.poste}
                      onChange={(e) => handleUpdateMembre(index, 'poste', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={membre.email}
                      onChange={(e) => handleUpdateMembre(index, 'email', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <input
                      type="tel"
                      value={membre.telephone}
                      onChange={(e) => handleUpdateMembre(index, 'telephone', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Département</label>
                    <input
                      type="text"
                      value={membre.departement}
                      onChange={(e) => handleUpdateMembre(index, 'departement', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                {editing && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDeleteMembre(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'departements' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Départements</h3>
            {editing && (
              <button
                onClick={handleAddDepartement}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Ajouter un département
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {formData.departements?.map((departement, index) => (
              <div key={departement.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={departement.nom}
                      onChange={(e) => handleUpdateDepartement(index, 'nom', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Responsable</label>
                    <input
                      type="text"
                      value={departement.responsable}
                      onChange={(e) => handleUpdateDepartement(index, 'responsable', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={2}
                      value={departement.description}
                      onChange={(e) => handleUpdateDepartement(index, 'description', e.target.value)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Effectif</label>
                    <input
                      type="number"
                      value={departement.effectif}
                      onChange={(e) => handleUpdateDepartement(index, 'effectif', parseInt(e.target.value) || 0)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <input
                      type="number"
                      value={departement.budget || ''}
                      onChange={(e) => handleUpdateDepartement(index, 'budget', parseInt(e.target.value) || undefined)}
                      disabled={!editing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                {editing && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDeleteDepartement(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;
