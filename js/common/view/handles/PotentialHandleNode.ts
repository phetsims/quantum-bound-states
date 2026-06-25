// Copyright 2026, University of Colorado Boulder

/**
 * PotentialHandleNode is the base class for all handles that are used to change some property of a quantum potential.
 * It consists of a double-head arrow with a label above it. The arrow is interactive, the label is not. The label's
 * visibility depends on a number of factors - see labelVisibleProperty.
 * The origin is at the center of the arrow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import Property from '../../../../../axon/js/Property.js';
import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../../kite/js/Shape.js';
import { optionize4 } from '../../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import AccessibleInteractiveOptions from '../../../../../scenery-phet/js/accessibility/AccessibleInteractiveOptions.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../../scenery-phet/js/ArrowNode.js';
import InteractiveHighlighting from '../../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { HomeEndKeyboardListener } from '../HomeEndKeyboardListener.js';
import PotentialHandleLabelNode from './PotentialHandleLabelNode.js';

const ARROW_NODE_OPTIONS = {
  doubleHead: true,
  headHeight: 11,
  headWidth: 15,
  tailWidth: 6
};

type ArrowOrientation = 'horizontal' | 'vertical';

type SelfOptions = {
  orientation: ArrowOrientation;
};

export type PotentialHandleNodeOptions = SelfOptions &
  PickOptional<ArrowNodeOptions, 'visibleProperty' | 'accessibleName' | 'accessibleHelpText' | 'accessibleFocusObjectResponse' | 'accessibleParagraphContent'> &
  PickRequired<ArrowNodeOptions, 'tandem'>;

export default abstract class PotentialHandleNode<T extends QuantumPotential> extends InteractiveHighlighting( Node ) {

  // The quantum potential that the handle is associated with.
  protected readonly potential: T;

  // The model-view transform for the Energy Diagram.
  protected readonly chartTransform: ChartTransform;

  // Whether the handle is being dragged.
  public readonly isDraggingProperty: Property<boolean>;

  // Double-head arrow that can be dragged.
  protected readonly arrowNode: ArrowNode;

  // The label that identifies the property that the handle is associated with.
  protected readonly labelNode: Node;

  // Vertical offset of the label above the arrow.
  protected static readonly LABEL_Y_OFFSET = -3;

  protected constructor( potential: T,
                         chartTransform: ChartTransform,
                         rangedProperty: TRangedProperty,
                         labelStringProperty: TReadOnlyProperty<string>,
                         valuesVisibleProperty: TReadOnlyProperty<boolean>,
                         providedOptions: PotentialHandleNodeOptions ) {

    const options = optionize4<PotentialHandleNodeOptions, SelfOptions, ArrowNodeOptions>()(
      {}, AccessibleInteractiveOptions, {

        // ArrowNodeOptions
        isDisposable: false,
        cursor: 'pointer',

        // As in Calculus Grapher, see https://github.com/phetsims/calculus-grapher/issues/405#issuecomment-4185183008.
        accessibleRoleDescription: QuantumBoundStatesFluent.a11y.handles.accessibleRoleDescriptionStringProperty,

        phetioVisiblePropertyInstrumented: true,
        visiblePropertyOptions: { phetioFeatured: true },
        phetioInputEnabledPropertyInstrumented: true
      }, providedOptions );

    super( options );

    this.potential = potential;
    this.chartTransform = chartTransform;

    // Whether the handle is being dragged, set by PotentialDragListener.
    this.isDraggingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isDraggingProperty' ),
      phetioDocumentation: 'Indicates whether the handle is being dragged.',
      phetioReadOnly: true
    } );

    // Set the arrow's tail and tip based on its orientation.
    const tailX = options.orientation === 'horizontal' ? -QBSConstants.HANDLE_LENGTH / 2 : 0;
    const tailY = options.orientation === 'horizontal' ? 0 : -QBSConstants.HANDLE_LENGTH / 2;
    const tipX = options.orientation === 'horizontal' ? QBSConstants.HANDLE_LENGTH / 2 : 0;
    const tipY = options.orientation === 'horizontal' ? 0 : QBSConstants.HANDLE_LENGTH / 2;

    this.arrowNode = new ArrowNode( tailX, tailY, tipX, tipY, ARROW_NODE_OPTIONS );
    this.addChild( this.arrowNode );

    this.labelNode = new PotentialHandleLabelNode( labelStringProperty, valuesVisibleProperty, options.tandem.createTandem( 'labelNode' ) );
    this.addChild( this.labelNode );
    this.labelNode.localBoundsProperty.link( () => this.updateLabelPosition( options.orientation ) );

    // Pointer area around arrow.
    const pointerArea = this.arrowNode.localBounds.dilatedXY( 5, 5 );
    this.mouseArea = pointerArea;
    this.touchArea = pointerArea;

    // Set focus highlight explicitly so that it does not include labelNode. Interactive highlight will default to focus highlight.
    this.setFocusHighlight( Shape.bounds( pointerArea ) );

    // Support for Home/End keyboard shortcuts.
    this.addInputListener( new HomeEndKeyboardListener( rangedProperty, {
      homeCallback: () => this.describeMoved(),
      endCallback: () => this.describeMoved(),
      tandem: options.tandem.createTandem( 'homeEndKeyboardListener' )
    } ) );

    // Change the arrow colors to indicate whether the handle is enabled.
    this.inputEnabledProperty.link( inputEnabled => {
      this.arrowNode.fill = inputEnabled ? QBSColors.handleFillProperty : QBSColors.handleDisabledFillProperty;
      this.arrowNode.stroke = inputEnabled ? QBSColors.handleStrokeProperty : QBSColors.handleDisabledStrokeProperty;
    } );

    // When the potential or chartTransform changes, update the position of the handle.
    potential.changedEmitter.addListener( () => this.updatePosition() );
    this.chartTransform.changedEmitter.addListener( () => this.updatePosition() );
    this.updatePosition();
  }

  /**
   * Updates the position of the handle.
   */
  protected abstract updatePosition(): void;

  /**
   * Updates the position of the label. Horizontally centered above the arrow by default.
   */
  protected updateLabelPosition( orientation: ArrowOrientation ): void {
    this.labelNode.centerX = this.arrowNode.centerX;
    this.labelNode.bottom = this.arrowNode.top + PotentialHandleNode.LABEL_Y_OFFSET;
  }

  /**
   * Describes the handle when it is moved.
   */
  public abstract describeMoved(): void;
}