import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Eye,
  User,
  Tag,
  Share2,
  ArrowLeft,
  Heart,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { ArticleService, CommentaireService } from '../../services/blogService';
import type { Article, CommentaireArticle } from '../../types/blog';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [commentaires, setCommentaires] = useState<CommentaireArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState({ nom: '', email: '' });

  useEffect(() => {
    if (slug) {
      chargerArticle();
    }
  }, [slug]);

  const chargerArticle = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const [articleData, commentairesData] = await Promise.all([
        ArticleService.getArticleParSlug(slug),
        ArticleService.getArticleParSlug(slug).then(article => {
          if (article) {
            return CommentaireService.getCommentairesParArticle(article.id);
          }
          return [];
        })
      ]);

      if (articleData) {
        setArticle(articleData);
        // Incrémenter les vues
        await ArticleService.incrementerVues(articleData.id);
      }

      setCommentaires(commentairesData);
    } catch (error) {
      console.error('Erreur chargement article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // TODO: Implémenter le système de likes
  };

  const handleShare = (platform: string) => {
    if (!article) return;

    const url = window.location.href;
    const text = `Découvrez cet article : ${article.titre}`;

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !newComment.trim() || !commentAuthor.nom || !commentAuthor.email) return;

    try {
      await CommentaireService.ajouterCommentaire({
        articleId: article.id,
        auteur: {
          id: 'anonymous',
          nom: commentAuthor.nom,
          email: commentAuthor.email
        },
        contenu: newComment
      });

      setNewComment('');
      setCommentAuthor({ nom: '', email: '' });

      // Recharger les commentaires
      const commentairesData = await CommentaireService.getCommentairesParArticle(article.id);
      setCommentaires(commentairesData);
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400">
            <h2 className="text-2xl font-bold mb-2">Article non trouvé</h2>
            <p className="mb-4">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au blog
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Catégorie */}
          <div className="mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: article.categorie.couleur + '20',
                color: article.categorie.couleur
              }}
            >
              {article.categorie.nom}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.titre}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium text-gray-900">{article.auteur.nom}</span>
            </div>

            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDate(article.datePublication)}
            </div>

            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {article.tempsLecture} min de lecture
            </div>

            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {article.vues} vues
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  liked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                <span>{article.likes + (liked ? 1 : 0)}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Partager</span>
                </button>

                {showShareOptions && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Twitter className="h-4 w-4 mr-3 text-blue-400" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Linkedin className="h-4 w-4 mr-3 text-blue-700" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Share2 className="h-4 w-4 mr-3" />
                      Copier le lien
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <MessageCircle className="h-4 w-4 inline mr-1" />
              {article.commentaires} commentaires
            </div>
          </div>
        </header>

        {/* Image principale */}
        {article.images.principale && (
          <div className="mb-8">
            <img
              src={article.images.principale}
              alt={article.titre}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {article.images.principale && (
              <p className="text-sm text-gray-500 mt-2 text-center italic">
                {article.images.principale}
              </p>
            )}
          </div>
        )}

        {/* Contenu */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.contenu }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/blog/tag/${tag}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Commentaires */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Commentaires ({commentaires.length})
          </h2>

          {/* Formulaire de commentaire */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Laisser un commentaire
            </h3>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={commentAuthor.nom}
                    onChange={(e) => setCommentAuthor(prev => ({ ...prev, nom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={commentAuthor.email}
                    onChange={(e) => setCommentAuthor(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre commentaire..."
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Publier le commentaire
              </button>
            </form>
          </div>

          {/* Liste des commentaires */}
          <div className="space-y-6">
            {commentaires.map(commentaire => (
              <div key={commentaire.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {commentaire.auteur.nom}
                      </h4>
                      <time className="text-sm text-gray-500">
                        {formatDateTime(commentaire.dateCreation)}
                      </time>
                    </div>
                    <p className="text-gray-700 mt-1">
                      {commentaire.contenu}
                    </p>
                    <div className="flex items-center mt-3 space-x-4">
                      <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {commentaire.likes}
                      </button>
                      {commentaire.reponses.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {commentaire.reponses.length} réponse(s)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {commentaires.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun commentaire pour le moment. Soyez le premier à commenter !
              </div>
            )}
          </div>
        </section>

        {/* Articles similaires */}
        <section className="border-t border-gray-200 pt-12 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Articles similaires
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* TODO: Implémenter les articles similaires */}
            <div className="text-center py-8 text-gray-500">
              Articles similaires à venir...
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};

export default ArticlePage;
