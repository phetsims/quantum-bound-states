// Copyright 2026, University of Colorado Boulder

/**
 * PotentialHandleNode is the base class for all handles that are used to change some property of a quantum potential.
 * Origin is at the center of the double-headed arrow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import AccessibleDraggableOptions from '../../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../../scenery-phet/js/ArrowNode.js';
import InteractiveHighlighting from '../../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { HomeEndKeyboardListener } from '../HomeEndKeyboardListener.js';

type SelfOptions = {
  orientation: 'horizontal' | 'vertical';
};

export type PotentialHandleNodeOptions = SelfOptions &
  PickOptional<ArrowNodeOptions, 'visibleProperty' | 'accessibleName' | 'accessibleHelpText' | 'accessibleFocusObjectResponse' | 'accessibleParagraphContent'> &
  PickRequired<ArrowNodeOptions, 'tandem'>;

export default abstract class PotentialHandleNode<T extends QuantumPotential> extends InteractiveHighlighting( ArrowNode ) {

  protected readonly potential: T;
  protected readonly chartTransform: ChartTransform;

  protected constructor( potential: T,
                         chartTransform: ChartTransform,
                         rangedProperty: TRangedProperty,
                         providedOptions: PotentialHandleNodeOptions ) {

    const options = optionize4<PotentialHandleNodeOptions, SelfOptions, ArrowNodeOptions>()(
      {}, AccessibleDraggableOptions, {

        // ArrowNodeOptions
        isDisposable: false,
        cursor: 'pointer',
        doubleHead: true,
        headHeight: 11,
        headWidth: 15,
        tailWidth: 6,
        phetioVisiblePropertyInstrumented: true,
        visiblePropertyOptions: { phetioFeatured: true },
        phetioInputEnabledPropertyInstrumented: true
      }, providedOptions );

    const tailX = options.orientation === 'horizontal' ? -QBSConstants.HANDLE_LENGTH / 2 : 0;
    const tailY = options.orientation === 'horizontal' ? 0 : -QBSConstants.HANDLE_LENGTH / 2;
    const tipX = options.orientation === 'horizontal' ? QBSConstants.HANDLE_LENGTH / 2 : 0;
    const tipY = options.orientation === 'horizontal' ? 0 : QBSConstants.HANDLE_LENGTH / 2;

    super( tailX, tailY, tipX, tipY, options );

    this.potential = potential;
    this.chartTransform = chartTransform;

    const pointerArea = this.localBounds.dilatedXY( 5, 5 );
    this.mouseArea = pointerArea;
    this.touchArea = pointerArea;

    this.addInputListener( new HomeEndKeyboardListener( rangedProperty, {
      homeCallback: () => this.describeMoved(),
      endCallback: () => this.describeMoved(),
      tandem: options.tandem.createTandem( 'homeEndKeyboardListener' )
    } ) );

    this.inputEnabledProperty.link( inputEnabled => {
      this.fill = inputEnabled ? QBSColors.handleFillProperty : QBSColors.handleDisabledFillProperty;
      this.stroke = inputEnabled ? QBSColors.handleStrokeProperty : QBSColors.handleDisabledStrokeProperty;
    } );

    this.chartTransform.changedEmitter.addListener( () => this.updatePosition() );
    potential.changedEmitter.addListener( () => this.updatePosition() );
    this.updatePosition();
  }

  /**
   * Updates the position of the handle.
   */
  protected abstract updatePosition(): void;

  /**
   * Describes the handle when it is moved.
   */
  public abstract describeMoved(): void;
}