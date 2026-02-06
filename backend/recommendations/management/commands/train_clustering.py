from django.core.management.base import BaseCommand
from recommendations.clustering import UserClustering

class Command(BaseCommand):
    help = 'Train K-Means clustering model on user data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting K-Means clustering training...\n')
        
        clustering = UserClustering(n_clusters=4)
        result = clustering.train_model()
        
        if result is not None:
            self.stdout.write(self.style.SUCCESS('✓ Clustering model trained successfully!'))
            
            # Show cluster characteristics
            chars = clustering.get_cluster_characteristics()
            if chars:
                self.stdout.write('\nCluster Characteristics:')
                for cluster_id, char in chars.items():
                    self.stdout.write(f"\n{char['name']}:")
                    self.stdout.write(f"  Size: {char['size']} users")
                    self.stdout.write(f"  Avg Age: {char['avg_age']:.1f}")
                    self.stdout.write(f"  Avg BMI: {char['avg_bmi']:.1f}")
                    self.stdout.write(f"  Avg Budget: NPR {char['avg_budget']:.0f}")
        else:
            self.stdout.write(self.style.WARNING('⚠ Not enough users to train model (need at least 4)'))