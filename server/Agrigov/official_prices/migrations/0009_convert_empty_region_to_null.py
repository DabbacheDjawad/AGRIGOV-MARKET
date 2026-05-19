from django.db import migrations, models

def forwards(apps, schema_editor):
    OfficialPrice = apps.get_model('official_prices', 'OfficialPrice')
    # Update all empty string region values to NULL
    OfficialPrice.objects.filter(region='').update(region=None)

def backwards(apps, schema_editor):
    # Optionally revert NULLs to '' (if needed)
    OfficialPrice = apps.get_model('official_prices', 'OfficialPrice')
    OfficialPrice.objects.filter(region=None).update(region='')

class Migration(migrations.Migration):

    dependencies = [
        ('official_prices', '0006_make_product_fk_required'),  # Change to your actual last good migration
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]