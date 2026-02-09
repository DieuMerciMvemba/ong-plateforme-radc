import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  Eye,
  User,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { ArticleService, CategorieService } from '../../services/blogService';
import type { Article, CategorieArticle, RechercheArticle } from '../../types/blog';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<CategorieArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState<RechercheArticle>({
    terme: '',
    statut: 'publie',
    tri: 'date_desc',
    page: 0,
    limite: 12
  });
  const [filtreCategorie, setFiltreCategorie] = useState<string>('toutes');

  useEffect(() => {
    chargerDonnees();
  }, []);

  useEffect(() => {
    rechercherArticles();
  }, [recherche, filtreCategorie]);

  const chargerDonnees = async () => {
    try {
      setLoading(true);
      const [articlesData, categoriesData] = await Promise.all([
        ArticleService.getArticlesPublies(1, 12),
        CategorieService.getCategoriesActives()
      ]);

      setArticles(articlesData.articles);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur chargement blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const rechercherArticles = async () => {
    try {
      const rechercheComplete: RechercheArticle = {
        ...recherche,
        categorie: filtreCategorie !== 'toutes' ? filtreCategorie : undefined
      };

      const resultats = await ArticleService.rechercherArticles(rechercheComplete);
      setArticles(resultats.articles);
    } catch (error) {
      console.error('Erreur recherche:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategorieInfo = (categorieId: string) => {
    return categories.find(cat => cat.id === categorieId);
  };

  const articlesVedettes = articles.filter(article => article.estVedette);
  const articlesRecents = articles.filter(article => !article.estVedette);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog RADC</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos actualités, réflexions et expériences sur le développement durable et l'action communautaire
            </p>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des articles..."
                  value={recherche.terme}
                  onChange={(e) => setRecherche(prev => ({ ...prev, terme: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-3">
              <select
                value={filtreCategorie}
                onChange={(e) => setFiltreCategorie(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="toutes">Toutes les catégories</option>
                {categories.map(categorie => (
                  <option key={categorie.id} value={categorie.id}>
                    {categorie.nom}
                  </option>
                ))}
              </select>

              <select
                value={recherche.tri}
                onChange={(e) => setRecherche(prev => ({ ...prev, tri: e.target.value as RechercheArticle['tri'] }))}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date_desc">Plus récents</option>
                <option value="date_asc">Plus anciens</option>
                <option value="populaire">Plus populaires</option>
                <option value="titre_asc">Titre A-Z</option>
                <option value="titre_desc">Titre Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Articles vedettes */}
        {articlesVedettes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Bookmark className="h-6 w-6 mr-2 text-yellow-500" />
              Articles à la une
            </h2>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articlesVedettes.slice(0, 3).map((article, index) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image principale */}
                  {article.images.principale && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={article.images.principale}
                        alt={article.titre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Catégorie */}
                    <div className="mb-3">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                        style={{
                          backgroundColor: getCategorieInfo(article.categorie.id)?.couleur + '20',
                          color: getCategorieInfo(article.categorie.id)?.couleur
                        }}
                      >
                        {article.categorie.nom}
                      </span>
                    </div>

                    {/* Titre */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200 group-hover:underline"
                      >
                        {article.titre}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Métadonnées */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="truncate max-w-20 sm:max-w-none">{article.auteur.nom}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="hidden xs:inline">{formatDate(article.datePublication)}</span>
                          <span className="xs:hidden">{formatDate(article.datePublication).split(' ')[2]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{article.tempsLecture} min</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">{article.vues} vues</span>
                          <span className="sm:hidden">{article.vues}</span>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${article.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
                      >
                        <span className="mr-2">Lire la suite</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles récents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {articlesVedettes.length > 0 ? 'Articles récents' : 'Tous les articles'}
          </h2>

          {articlesRecents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-sm">
                Aucun article trouvé
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articlesRecents.map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image principale */}
                  {article.images.principale && (
                    <div className="h-40 bg-gray-200">
                      <img
                        src={article.images.principale}
                        alt={article.titre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Catégorie */}
                    <div className="mb-2">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: getCategorieInfo(article.categorie.id)?.couleur + '20',
                          color: getCategorieInfo(article.categorie.id)?.couleur
                        }}
                      >
                        {article.categorie.nom}
                      </span>
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link to={`/blog/${article.slug}`} className="hover:text-blue-600 transition-colors">
                        {article.titre}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Métadonnées */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {article.auteur.nom}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(article.datePublication)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.tempsLecture} min
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {articles.length >= 12 && (
          <div className="flex justify-center mt-8">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Précédent
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Suivant
              </button>
            </nav>
          </div>
        )}

        {/* Newsletter signup */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Restez informés !
          </h3>
          <p className="text-gray-600 mb-6">
            Recevez nos derniers articles directement dans votre boîte mail
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
